/**
 * Startup Page Loader Plugin for Thymer v1.02
 * 
 * Automatically navigates to a specific page when the application starts.
 */

class Plugin extends AppPlugin {
  
    onLoad() {
      // Expose console toggle for enable/disable (e.g. homePageLoaderToggle())
      if (typeof window !== 'undefined') {
        window.homePageLoaderToggle = () => this.toggleEnabled();
        window.homePageLoaderEnabled = () => this.isEnabled();
      }
      
      // Wait for the app to fully initialize, then navigate (only if enabled)
      setTimeout(() => {
        this.loadStartupPage();
      }, 1500);
      
      // Add command to set the startup page
      this.ui.addCommandPaletteCommand({
        label: 'HomePage: Set Current Page as Startup',
        icon: 'home',
        onSelected: () => {
          this.setStartupPage();
        }
      });
      
      // Add command to manually trigger startup page load
      this.ui.addCommandPaletteCommand({
        label: 'HomePage: Go to Startup Page',
        icon: 'arrow-right',
        onSelected: () => {
          this.loadStartupPage();
        }
      });
      
      // Add command to toggle plugin enabled/disabled
      this.ui.addCommandPaletteCommand({
        label: 'HomePage: Toggle Startup Loader (Enable/Disable)',
        icon: 'settings',
        onSelected: () => {
          this.toggleEnabled();
        }
      });
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
      const pluginAPI = this.data.getPluginByGuid(this.getGuid());
      if (pluginAPI) {
        pluginAPI.saveConfiguration(config);
      }
      const state = config.custom.enabled ? 'enabled' : 'disabled';
      this.showToast(`Startup Page Loader ${state}`, true);
      return config.custom.enabled;
    }
    
    loadStartupPage() {
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
        // Retry if panel not ready yet
        setTimeout(() => this.loadStartupPage(), 500);
        return;
      }
      
      // Navigate to the startup page
      panel.navigateTo({
        type: 'edit_panel',
        rootId: startupPageGuid,
        subId: null,
        workspaceGuid: this.getWorkspaceGuid(),
        state: {}
      });
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
      
      // Save the current page GUID as the startup page
      const config = this.getConfiguration();
      config.custom = config.custom || {};
      config.custom.startupPageGuid = record.guid;
      
      // Save the configuration
      const pluginAPI = this.data.getPluginByGuid(this.getGuid());
      if (pluginAPI) {
        pluginAPI.saveConfiguration(config);
      }
      
      this.showToast(`"${record.getName()}" set as startup page`, true);
    }
    
    showToast(message, isSuccess = false) {
      this.ui.addToaster({
        title: isSuccess ? 'Success' : 'Startup Page Loader',
        message: message,
        dismissible: true,
        autoDestroyTime: isSuccess ? 3000 : 5000
      });
    }
  }
  