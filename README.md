# YAMYAM

> **Chew what you learn. Make it yours.**

yamyam is a C2C (Consumer-to-Consumer) talent marketplace where knowledge isn't just watched—it's consumed and mastered. Beyond fitness, we enable everyday experts to share skills in coding, design, cooking, music, and more through a community-driven booking platform.

---

## Features
- **Search & Browse** — keyword search + category filtering across all class listings
- **Create/Edit a Class** — 
- **Favourites** —
- **Direct Messaging** — Context-aware messaging system between students and instructors
    - **Instructor Inbox**: Dedicated workspace for instructors to manage all incoming inquiries from students
    - **Real-time Notifications**: Dynamic unread message badges in the navigation bar using Angular Signals and RxJS
- **Auth & Security** — Robust authentication system focused on session security and data integrity
    - **Session Management**: Automatic logout mechanism after 60 minutes of inactivity to protect user sessions
    - **Strict Validation**: Comprehensive registration validation including age restrictions (13-120) and complex password requirements
- **Profile** — Secure personal information management with administrative oversight
    - **Profile Verification**: Mandatory password confirmation step required before saving sensitive profile updates
    - **Admin Operations**: Exclusive dashboard for administrators to monitor, deactivate, or restore user accounts
    - **Administrative Flow**: Admin-specific privileges to edit any user profile with automated redirection back to the management console
