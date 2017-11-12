# Web Components inspector (supports Polymer)

## Install

### Prerequisites

Install [Rempl Chrome extension](https://chrome.google.com/webstore/detail/rempl/hcikjlholajopgbgfmmlbmifdfbkijdj?hl=en) which is a platform that will host Web Components inspector in the Chrome DevTools panel. For more information about this platform visit [Rempl GitHub repository](https://github.com/rempl/rempl).

### Production Mode

1. npm install && npm run build
1. drag&drop "/dist" to Chrome extensions

### Development Mode

1. npm install && npm start
1. drag&drop "/src/publisher" to Chrome extensions

Note: development environment would not work on HTTPS sites because inspector code is loaded from HTTP localhost. Build production dist if necessary.

## Usage

1. open app with web components in Chrome
1. open Chrome DevTools -> Rempl tab and use `Start Inspecting` button
