/**
 * Startup Page Loader Plugin for Thymer v1.0.3
 *
 * Automatically navigates to a specific page when the application starts.
 *
 * Thymer does not document an "app fully loaded" callback. This plugin waits for
 * the first `panel.focused` event (UI has an active panel) and falls back to a
 * timer so startup navigation still runs in edge cases. See `reload` on EventsAPI
 * if you need to re-sync after workspace/plugin reloads.
 */

const MAX_PANEL_RETRIES = 40;
/** If `panel.focused` never fires, run startup navigation after this delay (ms). */
const INITIAL_STARTUP_FALLBACK_MS = 5000;

class Plugin extends AppPlugin {
  onLoad() {
    if (typeof window !== 'undefined') {
      window.homePageLoaderToggle = () => {
        try {
          return this.toggleEnabled();
        } catch (err) {
          this.reportPluginError('homePageLoaderToggle', err);
        }
      };
      window.homePageLoaderEnabled = () => {
        try {
          return this.isEnabled();
        } catch (err) {
          this.reportPluginError('homePageLoaderEnabled', err);
        }
      };
    }

    this.scheduleInitialStartupNavigation();

    this.ui.addCommandPaletteCommand({
      label: 'HomePage: Set Current Page as Startup',
      icon: 'home',
      onSelected: () => {
        try {
          this.setStartupPage();
        } catch (err) {
          this.reportPluginError('setStartupPage', err);
        }
      }
    });

    this.ui.addCommandPaletteCommand({
      label: 'HomePage: Go to Startup Page',
      icon: 'arrow-right',
      onSelected: () => {
        try {
          this.loadStartupPage(0);
        } catch (err) {
          this.reportPluginError('loadStartupPage (command)', err);
        }
      }
    });

    this.ui.addCommandPaletteCommand({
      label: 'HomePage: Toggle Startup Loader (Enable/Disable)',
      icon: 'settings',
      onSelected: () => {
        try {
          this.toggleEnabled();
        } catch (err) {
          this.reportPluginError('toggleEnabled', err);
        }
      }
    });
  }

  /**
   * Run automatic startup navigation once, after the UI is likely ready.
   * Uses `panel.focused` from EventsAPI; see types.d.ts (EventsAPI / PluginEventPanel).
   */
  scheduleInitialStartupNavigation() {
    try {
      const custom = this.getConfiguration().custom || {};
      if (custom.enabled === false || !custom.startupPageGuid) {
        return;
      }
    } catch (err) {
      this.reportPluginError('scheduleInitialStartupNavigation (config)', err);
      return;
    }

    let ran = false;
    let handlerId = null;

    const runOnce = () => {
      if (ran) return;
      ran = true;
      if (handlerId != null) {
        try {
          this.events.off(handlerId);
        } catch (_) {}
        handlerId = null;
      }
      try {
        this.loadStartupPage(0);
      } catch (err) {
        this.reportPluginError('loadStartupPage (initial)', err);
      }
    };

    try {
      handlerId = this.events.on('panel.focused', () => runOnce());
    } catch (err) {
      this.reportPluginError('events.on panel.focused', err);
    }

    setTimeout(runOnce, INITIAL_STARTUP_FALLBACK_MS);
  }

  reportPluginError(context, err) {
    const msg =
      err && typeof err === 'object' && 'message' in err && err.message != null
        ? String(err.message)
        : String(err);
    try {
      this.ui.addToaster({
        title: 'Startup Page Loader',
        message: `${context}: ${msg}`,
        dismissible: true,
        autoDestroyTime: 8000
      });
    } catch (_) {
      console.error('[Startup Page Loader]', context, err);
    }
  }

  savePluginConfiguration(config) {
    const pluginAPI = this.data.getPluginByGuid(this.getGuid());
    if (!pluginAPI) return;
    try {
      const result = pluginAPI.saveConfiguration(config);
      if (result && typeof result.then === 'function') {
        result.catch((err) => this.reportPluginError('saveConfiguration', err));
      }
    } catch (err) {
      this.reportPluginError('saveConfiguration', err);
    }
  }

  isEnabled() {
    const config = this.getConfiguration();
    const custom = config.custom || {};
    return custom.enabled !== false;
  }

  toggleEnabled() {
    const config = this.getConfiguration();
    config.custom = config.custom || {};
    config.custom.enabled = !(config.custom.enabled !== false);
    this.savePluginConfiguration(config);
    const state = config.custom.enabled ? 'enabled' : 'disabled';
    this.showToast(`Startup Page Loader ${state}`, true);
    return config.custom.enabled;
  }

  loadStartupPage(retryCount = 0) {
    try {
      const config = this.getConfiguration();
      const customSettings = config.custom || {};
      if (customSettings.enabled === false) {
        return;
      }
      const startupPageGuid = customSettings.startupPageGuid;

      if (!startupPageGuid) {
        return;
      }

      const panel = this.ui.getActivePanel();

      if (!panel) {
        if (retryCount < MAX_PANEL_RETRIES) {
          setTimeout(() => {
            try {
              this.loadStartupPage(retryCount + 1);
            } catch (err) {
              this.reportPluginError('loadStartupPage (retry)', err);
            }
          }, 500);
        }
        return;
      }

      try {
        const navResult = panel.navigateTo({
          type: 'edit_panel',
          rootId: startupPageGuid,
          subId: null,
          workspaceGuid: this.getWorkspaceGuid(),
          state: {}
        });
        if (navResult && typeof navResult.then === 'function') {
          navResult.catch((err) =>
            this.reportPluginError('navigateTo startup page', err)
          );
        }
      } catch (err) {
        this.reportPluginError('navigateTo startup page', err);
      }
    } catch (err) {
      this.reportPluginError('loadStartupPage', err);
    }
  }

  setStartupPage() {
    const panel = this.ui.getActivePanel();

    if (!panel) {
      this.showToast('No active panel');
      return;
    }

    const record = panel.getActiveRecord();

    if (!record) {
      this.showToast('No page currently open. Please open a page first.');
      return;
    }

    const config = this.getConfiguration();
    config.custom = config.custom || {};
    config.custom.startupPageGuid = record.guid;

    this.savePluginConfiguration(config);

    let title;
    try {
      title = record.getName();
    } catch (err) {
      this.reportPluginError('getName', err);
      title = 'Page';
    }
    this.showToast(`"${title}" set as startup page`, true);
  }

  showToast(message, isSuccess = false) {
    try {
      this.ui.addToaster({
        title: isSuccess ? 'Success' : 'Startup Page Loader',
        message: message,
        dismissible: true,
        autoDestroyTime: isSuccess ? 3000 : 5000
      });
    } catch (err) {
      console.error('[Startup Page Loader] addToaster', err);
    }
  }
}
