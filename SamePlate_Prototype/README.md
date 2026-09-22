# SamePlate Prototype

SamePlate is an interactive web prototype with a simple home page. It includes the original home page, the Toowong Kitchen menu, a multi-item basket, whole-order price comparison, and channel selection.

## How to Open

1. Extract the ZIP file completely.
2. Open the `SamePlate_Prototype` folder, double-click `index.html`, and open it in Chrome, Edge, or Firefox.
3. This is a plain HTML, CSS, and JavaScript project. No Node.js, npm, or other dependencies are required.

## Edit in VS Code

1. In VS Code, select File → Open Folder and open the extracted `SamePlate_Prototype` folder.
2. Edit the relevant file, save it, and refresh the browser to see the changes.
3. If you have the Live Server extension installed, right-click `index.html` and select Open with Live Server.

## File Guide

- `index.html`: Home page, menu, comparison, completion page, and price explanation modal.
- `styles.css`: Desktop and mobile layouts, colors, and styling.
- `app.js`: Sample menu items and platform prices, basket, calculation logic, and page interactions.
- `assets/toowong-kitchen.webp`: Image used in the prototype.

## Demo Flow

Home → View menu → Add one Classic Smash Burger, one Loaded Fries, and two House Iced Teas → Compare this order → Review the fee breakdown → Select a channel → Continue with this option → Back to home.

You can increase or decrease item quantities, switch menu categories, or select Modify order on the comparison page to make changes.

## Price Calculation

All amounts are shown in Australian dollars (AUD).

- Typical delivery price: The median menu price for the same item across the three example platforms.
- Typical delivery subtotal: The median price for each item multiplied by its quantity, then added together. This excludes delivery and service fees. The order page (Build your order) shows only this summary figure; platform subtotal ranges and the pickup reference price are shown by channel on the next whole-order comparison page.
- Final total: The selected channel's item subtotal plus delivery and service fees.
- Restaurant pickup: The restaurant pickup item subtotal with no platform fees, shown as one of the available channels on the whole-order comparison page.

## Demo Data and Scope

The item prices, platform fees, and delivery times in this project are illustrative settings. They are not live data and do not represent the current fees or service conditions of any platform. The interface retains the Uber Eats, DoorDash, and Menulog example channels from the prototype.

Promotions and coupons are not applied. The prototype does not connect to delivery platforms, submit orders, or process payments. The page after channel selection is the end of the demo flow. Refreshing the page clears the current basket.

Online version: https://sameplate-prototype.yaoziyan020704.chatgpt.site
