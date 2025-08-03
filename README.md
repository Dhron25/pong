<div align="center">
  <a href="https://shipwrecked.hackclub.com/?t=ghrm" target="_blank">
    <img src="https://hc-cdn.hel1.your-objectstorage.com/s/v3/739361f1d440b17fc9e2f74e49fc185d86cbec14_badge.png" 
         alt="This project is part of Shipwrecked, the world's first hackathon on an island!" 
         style="width: 35%;">
  </a>
</div>



# HideBehindThePicture

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

A modern, client-side steganography tool that allows you to hide encrypted messages within images and detect the potential presence of hidden data in others.



## Overview

**HideBehindThePicture** is a web-based application built with React and Vite that provides robust steganography capabilities directly in your browser. All processing is done on the client-side, meaning your images and secrets are never uploaded to a server, ensuring complete privacy and security.

## Core Features

-   **🔒 Encrypt & Hide**: Embed a secret message into an image. The message is first encrypted using either AES-256 or RSA-2048 (simplified implementations) before being concealed in the image pixels.
-   **🔓 Decrypt & Extract**: Reveal a hidden message from a steganography image using the correct password.
-   **🔍 Steganalysis (Beta)**: Analyze an image for statistical anomalies that might indicate the presence of hidden data. This includes Least Significant Bit (LSB) analysis and other pattern checks.
-   **💻 100% Client-Side**: Your files and data never leave your computer. All encryption, hiding, and analysis happens in the browser.


## Tech Stack

-   **Framework**: [React](https://reactjs.org/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **EXIF Data Reading**: [exifreader](https://github.com/mattiasw/exifreader)
-   **HEIC to JPEG Conversion**: [heic2any](https://github.com/alexcorvi/heic2any)

## Getting Started

To run this project locally, follow these steps.

### Prerequisites

-   [Node.js](https://nodejs.org/) (version 16 or later recommended)
-   [npm](https://www.npmjs.com/) (usually comes with Node.js)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd your-repo-name
    ```

3.  **Install the dependencies:**
    ```bash
    npm install
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application should now be running on `http://localhost:5173` (or another port if 5173 is busy).

## How to Use

### To Hide a Message
1.  Navigate to the **Hide Message** tab.
2.  Click **Upload Image** and select a supported image file (JPG, PNG, WebP, HEIC).
3.  Choose an **Encryption Level** (AES-256 or RSA-2048).
4.  Type your secret message in the textarea.
5.  Enter a secure password (this is required to extract the message later).
6.  Click **Encrypt & Hide Message**.
7.  If successful, a preview of the new image will appear. Click **Download Image** to save it.

### To Extract a Message
1.  Navigate to the **Extract Message** tab.
2.  Upload the image that contains the hidden message.
3.  Enter the exact password that was used to hide the message.
4.  Click **Extract & Decrypt Message**.
5.  If the password is correct, the hidden message will be revealed below.

### To Detect Hidden Data (Beta)
1.  Navigate to the **Detect Hidden Data (Beta)** tab.
2.  Upload any image you want to analyze.
3.  Click **Analyze Image**.
4.  The tool will display any found **EXIF Metadata** and provide a **Suspicion Score** based on statistical analysis of the image's pixel data.
