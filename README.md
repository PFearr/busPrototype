# Bus Location Prototype

**Bus Location Prototype**, shortened to **BLP**, is a real-time bus location display system built for my high school.

The project was created to solve a daily problem at my school, students would come outside at dismissal and not know where their bus was parked. Since buses did not always stop in their assigned spots, students often had to search the lot, which caused confusion and sometimes made them miss their bus. I even personally had trouble looking for my bus.

BLP allowed a school administrator or bus director to manually update bus locations through a control panel. Student-facing displays updated in real time so students could quickly see where their bus was located.

## Overview

High Schools serves students from multiple towns and districts. At dismissal, many buses arrive in the same general area, but they do not always park in the expected spots.

To fix this, I built a web-based system where:

- A staff member updates bus positions from an admin/control page
- Students view current bus locations from a public display page
- Lobby TVs can show the current bus status
- Updates happen in real time without refreshing the page

The system was designed as a web app because it could run on phones, computers, and school displays without needing an App Store release or device-specific installation.

## Problem

Students had no reliable way to know where their bus was located after school.

Common issues included:

- Buses parking outside their assigned spots
- Students walking around the lot searching for their bus
- Students missing buses because they could not find them quickly
- Staff needing a faster way to communicate bus positions

## Solution

BLP provides a real-time bus tracking display where a staff member can manually place or update buses as they arrive.

When the bus director changes a bus location, the update is immediately pushed to all connected student displays using real-time communication.

This allowed students to check the website or view school lobby TVs to see where their bus was currently located.

## Features

- Real-time bus location updates
- Admin/control page for staff
- Student-facing bus display page
- Mobile-friendly and desktop-friendly interface
- Lobby TV display support
- Socket-based live updates without page refreshes
- Manual bus placement by school staff
- Local network access control for the admin page
- Designed for use during school dismissal
- Built around a real operational problem at school

## Tech Stack

- **JavaScript**
- **Node.js**
- **Socket.IO**
- **HTML**
- **CSS**
- **WebSockets**

## How It Works

The system uses a Node.js server to manage bus location data and serve the web pages.

The student display page connects to the server and waits for live updates. The admin/control page allows an authorized staff member to update bus locations.

When a bus location is changed:

1. The staff member updates the bus location from the control page.
2. The client sends the update to the Node.js server.
3. The server broadcasts the update using Socket.IO to all clients and saves the data for new clients.
4. Student displays & lobby TVs update instantly without requiring a page refresh.


## Security and Access Control

One issue during development was that the admin page needed protection. Since the control panel could change bus locations, it could not be publicly available to everyone.

The admin/control page was designed to only be accessible with either a password or a the device connected to a certain WiFi

Security considerations included:

- Restricting admin access to the school’s staff Wi-Fi/network
- Keeping student-facing pages separate from staff controls
- Preventing unauthorized users from changing bus locations
- Designing the admin page for local school use instead of public internet access

## Network Challenges

During testing, the Wi-Fi signal did not fully reach the bus parking area. This created a problem because the bus director needed network access while updating bus positions from outside.

To help solve this, the school placed a Wi-Fi extender near the parking lot so the bus director could access the local network and update bus locations reliably.

## Why Web-Based?

I chose to make BLP web-based because:

- It works on phones, laptops, desktops, and TVs
- No App Store or Play Store deployment is required
- It is easier for a school to open a website than install software
- It can be updated quickly
- It supports real-time communication through JavaScript and Socket.IO
- It can be displayed on lobby TVs for students
- Deploying it main stream is much easier than any software as a couple of commands can build and start the server.


## Project Status

This was a prototype built to demonstrate and solve the bus visibility issue at my High School.

Future improvements could include:

- User login for staff
- Better admin authentication
- Database storage for bus routes and towns
- Bus arrival history
- Automatic reset after dismissal
- Improved TV display mode
- Better mobile control panel
- QR code access for students
- Role-based access control
- Animations for new entries.
- Deployment documentation

## Academic Research / Technical Justification

This project was built using JavaScript and Node.js because they are well-suited for real-time web applications.

During research, I reviewed sources discussing JavaScript and Node.js performance, including topics such as:

- JavaScript usage in modern web applications
- Testing challenges in JavaScript-based web apps
- Node.js server-side architecture
- Node.js compared to PHP and Python
- Non-blocking asynchronous programming
- Node.js performance in data-intensive and real-time applications
- WebSocket-based real-time communication

These sources helped support the decision to build BLP as a JavaScript-based real-time web application instead of a traditional static website or native mobile app.

## Showcase

[![Watch Showcase](https://img.youtube.com/vi/oCsKN7n3-2E/0.jpg)](https://www.youtube.com/watch?v=oCsKN7n3-2E)

