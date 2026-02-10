\# Thymer Startup Page Loader

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Thymer Plugin](https://img.shields.io/badge/Thymer-Plugin-blue)](https://thymer.com/plugins/)

A lightweight plugin for [Thymer](https://thymer.com) that automatically navigates to your chosen page when the application starts.

![Demo](https://via.placeholder.com/800x400?text=Startup+Page+Loader+Demo)

\## Features

✨ **Auto-load on startup** - Opens your chosen page automatically when Thymer loads
⚙️ **Easy configuration** - Set any page as your startup page with one command
🚀 **Manual navigation** - Quick command to jump to your startup page anytime
💾 **Persistent settings** - Your preference is saved and synced

\## Installation

\### Method 1: Direct Install (Recommended)

1. Open Thymer and press `Cmd+P` (Mac) or `Ctrl+P` (Windows)
2. Type **"Plugins"** and select it
3. Click **"Create Plugin"** → Choose **"Global Plugin"**
4. Copy the contents of [`plugin.js`](./plugin.js) into the **Custom Code** field
5. Copy the contents of [`plugin.json`](./plugin.json) into the **Configuration** field
6. Click **"Save"**


\### Method 2: Development Install

For plugin development with hot-reload:

\```bash
git clone https://github.com/yourusername/thymer-startup-page-loader.git
cd thymer-startup-page-loader
npm install
npm run dev
\```

See [Development]( ##development) section for details.

\## Usage

\### Setting Your Startup Page

1. **Open the page** you want to load on startup
2. Press `Cmd+P` / `Ctrl+P` to open the Command Palette
3. Type **"Set Current Page as Startup Page"**
4. Press Enter


✅ Done! This page will now load automatically when Thymer starts.

\### Manual Navigation

Navigate to your startup page at any time:

1. Press `Cmd+P` / `Ctrl+P`
2. Type **"Go to Startup Page"**
3. Press Enter


\### Changing Startup Page

Simply open a different page and run **"Set Current Page as Startup Page"** again.

\### Disabling Auto-load

Edit the plugin configuration and set `startupPageGuid` to `null`:

\```json
{
"custom": {
"startupPageGuid": null
}
}
\```

\## Configuration

The plugin stores settings in `plugin.json`:

\```json
{
"name": "Startup Page Loader",
"icon": "home",
"description": "Automatically loads a specific page when Thymer starts",
"ver": 1,
"custom": {
"startupPageGuid": "your-page-guid-here"
}
}
\```

\### Configuration Options

| Option            | Type           | Default | Description                         |
| ----------------- | -------------- | ------- | ----------------------------------- |
| `startupPageGuid` | string \| null | `null`  | GUID of the page to load on startup |

\## Development

\### Prerequisites

\- Node.js (v14 or higher)
\- Chrome browser
\- Thymer account

\### Setup

1. Clone the repository:


\```bash
git clone https://github.com/yourusername/thymer-startup-page-loader.git
cd thymer-startup-page-loader
\```

2. Install dependencies:


\```bash
npm install
\```

3. Start Chrome with debugging enabled:


\```bash
\# macOS
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
--remote-debugging-port=9222 \
--user-data-dir="/tmp/chrome-debug-profile" \
https://myaccount.thymer.com

\# Windows/Linux
chrome --remote-debugging-port=9222 https://myaccount.thymer.com
\```

4. Enable Hot Reload in Thymer:


\- Open Thymer in the debugging Chrome window
\- Press `Cmd+P` / `Ctrl+P` → "Plugins"
\- Create or edit your plugin
\- Go to **Developer Tools** tab
\- Click **"Enable Plugin Hot Reload"**

5. Start development mode:


\```bash
npm run dev
\```

6. Edit `plugin.js` or `plugin.json` - changes will hot-reload automatically!


\### Build Commands

\```bash
npm run dev           # Start development mode with hot-reload
npm run dev:verbose   # Development mode with verbose logging
npm run build         # Build for production (outputs to dist/)
\```

\### Project Structure

\```
thymer-startup-page-loader/
├── plugin.js              # Main plugin code
├── plugin.json            # Plugin configuration
├── package.json           # NPM dependencies
├── dev.js                 # Build and hot-reload script
├── README.md              # This file
├── LICENSE                # MIT license
├── CHANGELOG.md           # Version history
├── CONTRIBUTING.md        # Contribution guidelines
├── .gitignore             # Git ignore rules
└── .github/               # GitHub-specific files
├── ISSUE_TEMPLATE/
│   ├── bug_report.md
│   └── feature_request.md
└── PULL_REQUEST_TEMPLATE.md
\```

\## Customization Examples

\### Example 1: Increase Startup Delay

If the page doesn't load reliably, increase the delay:

\```javascript
onLoad() {
setTimeout(() => {
this.loadStartupPage();
}, 3000); // Wait 3 seconds instead of 1.5
// ...
}
\```

\### Example 2: Open in New Panel

Create a new panel for the startup page:

\```javascript
async loadStartupPage() {
const config = this.getConfiguration();
const startupPageGuid = config.custom?.startupPageGuid;

if (!startupPageGuid) return;

const newPanel = await this.ui.createPanel();
if (newPanel) {
newPanel.navigateTo({
type: 'edit_panel',
rootId: startupPageGuid,
subId: null,
workspaceGuid: this.getWorkspaceGuid()
});
}
}
\```

\### Example 3: Open Today's Journal

Load today's journal page instead of a specific page:

\```javascript
loadStartupPage() {
const panel = this.ui.getActivePanel();
if (!panel) return;

const user = this.data.getActiveUsers()[0];
panel.navigateToJournal(user, DateTime.parseDateTimeString('today'));
}
\```

\## Troubleshooting

\### Page doesn't load on startup

1. **Check configuration**: Verify `startupPageGuid` is set in plugin.json
2. **Increase delay**: Edit plugin.js and change timeout from 1500 to 3000
3. **Test manually**: Try the "Go to Startup Page" command
4. **Check page exists**: The page may have been deleted


\### "No page currently open"

Make sure a page is actually open when you run "Set Current Page as Startup Page"

\### Configuration not saving

Check the browser console (F12) for errors. The plugin may not have permission to save.

\## API Reference

\### Thymer SDK APIs Used

\- `this.ui.getActivePanel()` - Get the currently focused panel
\- `panel.getActiveRecord()` - Get the page open in a panel
\- `panel.navigateTo()` - Navigate to a different page
\- `this.data.getPluginByGuid()` - Get plugin API object
\- `this.ui.addCommandPaletteCommand()` - Register commands
\- `this.ui.addToaster()` - Show notifications

\## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

\### Quick Start for Contributors

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit (`git commit -m 'Add amazing feature'`)
6. Push to your fork (`git push origin feature/amazing-feature`)
7. Open a Pull Request


\## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history.

\## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

\## Support

\- **Issues**: [GitHub Issues](https://github.com/yourusername/thymer-startup-page-loader/issues)
\- **Thymer Plugin SDK**: [thymer-plugin-sdk](https://github.com/thymerapp/thymer-plugin-sdk)
\- **Thymer Plugins**: [thymer.com/plugins](https://thymer.com/plugins/)

\## Acknowledgments

\- Built with the [Thymer Plugin SDK](https://github.com/thymerapp/thymer-plugin-sdk)
\- Inspired by browser extension "New Tab" functionality

\---

Made with ❤️ for the Thymer community