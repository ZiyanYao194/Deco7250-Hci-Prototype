# SamePlate Prototype

带简单主页的 SamePlate 可交互网页原型。包含原有主页、Toowong Kitchen 菜单、多餐品购物篮、整单比价和渠道选择流程。

## 如何打开

1. 先完整解压 ZIP 文件。
2. 进入 `SamePlate_Prototype` 文件夹，双击 `index.html`，用 Chrome、Edge 或 Firefox 打开即可。
3. 这是纯 HTML、CSS 和 JavaScript 项目，无需安装 Node.js、npm 或其他依赖。

## 在 VS Code 中编辑

1. 在 VS Code 选择 File → Open Folder，打开解压后的 `SamePlate_Prototype` 文件夹。
2. 编辑对应文件，保存后刷新浏览器查看效果。
3. 如果你已安装 Live Server 扩展，可以右键 `index.html` → Open with Live Server。

## 文件说明

- `index.html`：主页、菜单、比价、完成页及价格说明弹窗。
- `styles.css`：桌面和手机布局、颜色与样式。
- `app.js`：示例餐品和平台价格、购物篮、计算逻辑及页面交互。
- `assets/toowong-kitchen.webp`：页面使用的图片。

## 演示步骤

主页 → View menu → 添加一份 Classic Smash Burger、一份 Loaded Fries 和两杯 House Iced Tea → Compare this order → 查看费用明细 → 选择渠道 → Continue with this option → Back to home。

可以增加或减少餐品数量、切换餐品分类，或在比价页点击 Modify order 返回修改。

## 价格计算

所有金额以澳元（AUD）显示。

- Typical delivery price：同一餐品在三个示例平台上的菜单价格中位数。
- Typical delivery subtotal：每件餐品的中位数价格 × 数量，再求和；不包含配送费和服务费。订单页（Build your order）只展示这一个汇总数字，各平台小计区间和自取参考价改为在下一步整单比价页按渠道逐一显示。
- Final total：所选渠道的餐品小计 + 配送费 + 服务费。
- Restaurant pickup：餐厅自取餐品小计，无平台费用，在整单比价页作为其中一个可选渠道呈现。

## 演示数据与范围

本项目中的餐品价格、平台费用和配送时间均为演示设定，不是实时数据，也不代表平台当前的收费规则或服务情况。界面保留原型中的 Uber Eats、DoorDash 和 Menulog 示例渠道。

当前未应用促销或优惠券，不连接外卖平台、不发送订单、不处理付款。渠道选择后的页面就是演示终点。刷新页面会清空当前购物篮。

在线版本：https://sameplate-prototype.yaoziyan020704.chatgpt.site
