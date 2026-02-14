/**
 * Startup Page Loader Plugin for Thymer v1.01
 * 
 * Automatically navigates to a specific page when the application starts.
 */

class Plugin extends AppPlugin {
  
    onLoad() {
      // Wait for the app to fully initialize, then navigate
      setTimeout(() => {
        this.loadStartupPage();
      }, 1500);
      
      // Add command to set the startup page
      this.ui.addCommandPaletteCommand({
        label: 'HomePage: Set Current Page as Startup Page',
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
    }
    
    loadStartupPage() {
      const config = this.getConfiguration();
      const customSettings = config.custom || {};
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
  