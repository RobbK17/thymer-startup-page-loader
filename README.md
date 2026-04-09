# Thymer HomePage Loader (Startup Page)

[![Thymer Plugin](https://img.shields.io/badge/Thymer-Plugin-blue)](https://thymer.com/plugins/)
[![Version](https://img.shields.io/badge/version-1.0.3-informational)](https://github.com/RobbK17/thymer-startup-page-loader)

**Version 1.0.3**

A small [Thymer](https://thymer.com) global plugin that opens a chosen page when the app starts, with palette commands to set the page, jump to it, or turn auto-load on and off.

## Features

- **Auto-load on startup** — Opens your saved page once the workspace UI is ready; a short backup timer still runs navigation if timing is tight.
- **Palette commands** — Set startup page from the current page, go there anytime, or toggle the loader without editing JSON.
- **Persistent config** — `startupPageGuid` and `enabled` are stored in the plugin configuration.

## Installation

1. In Thymer, press `Cmd+P` (Mac) or `Ctrl+P` (Windows/Linux).
2. Open **Plugins**.
3. Choose **Create Plugin** → **Global Plugin** (or edit an existing one).
4. Paste the contents of [`plugin.js`](./plugin.js) into **Custom Code**.
5. Paste the contents of [`plugin.json`](./plugin.json) into **Configuration** (or merge the `custom` block into your existing config).
6. Save.

## Usage

### Set your startup page

1. Open the page you want.
2. Command palette → **HomePage: Set Current Page as Startup**.

### Go to the startup page manually

Command palette → **HomePage: Go to Startup Page**.

### Enable or disable auto-load

Command palette → **HomePage: Toggle Startup Loader (Enable/Disable)**  
(or set `"enabled": false` in configuration — see below).

## Configuration

Settings live under `custom` in [`plugin.json`](./plugin.json):

```json
{
  "custom": {
    "startupPageGuid": null,
    "enabled": true
  }
}
```

| Option              | Type           | Default | Description                                      |
| ------------------- | -------------- | ------- | ------------------------------------------------ |
| `startupPageGuid`   | string \| null | `null`  | GUID of the page to open on startup / on command |
| `enabled`           | boolean        | `true`  | When `false`, startup navigation is skipped      |

To stop auto-load without removing the GUID, set `"enabled": false` or use the toggle command.

## How startup navigation works

The plugin waits until Thymer has an active panel, then navigates to your startup page once. If that moment is hard to detect, it also tries again after about **5 seconds**. If no panel is available yet, it keeps retrying briefly until one appears.

## Troubleshooting

- **Nothing happens on startup** — Confirm `startupPageGuid` is set and `enabled` is not `false`. Try **HomePage: Go to Startup Page** manually.
- **“No page currently open”** — Open a page in the active panel before **Set Current Page as Startup**.
- **Errors when saving** — Watch for toaster notifications; they often explain what went wrong.

## Links

- [Thymer Plugins](https://thymer.com/plugins/)
- [GitHub — thymer-startup-page-loader](https://github.com/RobbK17/thymer-startup-page-loader)
