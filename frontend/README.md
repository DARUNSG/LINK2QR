# Link2QR — Turn Any Link Into a QR Code

A clean, responsive, and private web-based QR code generation application built with React, TypeScript, Tailwind CSS v4, and the `qrcode` library.

![Link2QR Preview](public/preview-banner.svg)

---

## 🎨 Mandatory Palette

Link2QR strictly adopts the following 5-color aesthetic:

- **Primary Light Blue**: `#DBEAFE` (Hero headlines, primary buttons, borders, preview surfaces)
- **Dark Background / Primary Dark**: `#0B0B0F` (Base background, navbar, buttons on pastel, inputs)
- **Soft Lavender**: `#EDE9FE` (Body typography, secondary surfaces, alternate feature cards)
- **Soft Pink**: `#FCE7F3` (Accents, decorative pill tags, alternate feature cards)
- **Warm Brown**: `#5D4037` (Subtle dividers, step markers, decorative micro-details)

---

## 🚀 Features

- **Instant QR Generation**: Encodes real HTTP/HTTPS URLs dynamically using client-side canvas rasterization.
- **Strict Validation**: Verifies URL validity with immediate visual feedback for malformed entries.
- **Deep Customization**:
  - Foreground & background color selectors with live contrast ratio calculation and low-contrast warnings.
  - Multi-resolution sizing (`Small: 200px`, `Medium: 300px`, `Large: 450px`).
  - One-click reset to default black/white for optimal scan reliability.
- **High-Quality PNG Download**: Clean, uncompressed PNG exports formatted with automatic filename tags based on hostname.
- **Alternating Pastel Surfaces**: Visual cards cycling between `#DBEAFE`, `#EDE9FE`, and `#FCE7F3` with high-contrast `#0B0B0F` typography.
- **Zero Backend / Complete Privacy**: Encodes payloads directly in the browser—no accounts, databases, tracking, or network transmission of your links.
- **Fully Responsive & Accessible**: Supports desktop, tablet, and mobile displays with WCAG-compliant contrast ratios and keyboard navigation.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4
- **QR Generation**: [`qrcode`](https://www.npmjs.com/package/qrcode)
- **Icons**: [`lucide-react`](https://lucide.dev)
- **Bundler & Tooling**: Vite 8

---

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite local development server:
   ```bash
   npm run dev
   ```

4. Open your browser at:
   ```
   http://localhost:5173
   ```

### Production Build

To test and compile a production build:
```bash
npm run build
```

To preview the production bundle locally:
```bash
npm run preview
```

---

## 📱 How to Verify & Scan

1. Enter any destination URL (e.g., `https://github.com` or `https://example.com`) in the input box.
2. Click **Generate QR Code**.
3. Open your smartphone camera or QR scanning app and point it at the live preview card on your screen.
4. Verify that your camera immediately identifies and prompts you to open the destination link.
5. Click **Download PNG** to save the QR code image for print or digital sharing.
