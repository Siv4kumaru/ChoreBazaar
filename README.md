
## Demo

https://drive.google.com/file/d/1av-1CUsJis6iRHAYayLmiB_8FxlYblf4/view?usp=sharing

Project Overview

This project is a service request management system designed with a flexible database structure to support user roles and service interactions. The system employs role-based access control (RBAC) using Flask Security, ensuring secure and role-specific access to application functionalities. The core database design, visualized below, supports multiple entities including Users, Professionals, Customers, Services, and Service Requests, with robust data integrity measures.
Database Schema

Below is the database schema diagram for the project, illustrating the relationships and attributes of the key entities:

Database Schema

![image](https://github.com/user-attachments/assets/c5bf3465-2c56-48fa-ae57-e94c8aa90164)


Features

    Role-Based Access Control (RBAC): Implemented with Flask Security for secure access.
    API Development: Utilizes Flask-RESTful with secured endpoints.
    Database Management: SQLite with SQLAlchemy ORM for CRUD operations.
    Development Tools:
        API testing with Thunder Client.
        Design in Figma and Canva.
        Debugging with Windows Developer Tools for Vue.js.
    Mailing Services: Tested with MailHog.
    Development Environment: WSL (Ubuntu) with a custom tmux script to manage SMTP, Redis servers, and Celery workers.

Technologies and Libraries

    Frontend:
        Vue.js (@2.7.16)
        Vuex (@3.0.0)
        jQuery (3.3.1)
        Bootstrap (@5.3.3)
        Google Fonts
    Backend:
        Python (requirements in ./Code/requirements.txt)
        Flask, Flask-RESTful, Flask-Security
        SQLAlchemy ORM
    Development Environment:
        WSL 2 (Ubuntu)
        MailHog
        IDE: VSCode
        OS: Windows 11

Installation Instructions
Prerequisites

    Python 3.x
    WSL 2 with Ubuntu distribution
    Git (for cloning the repository)

Steps

    Clone the Repository
    bash

git clone <repository-url>
cd <repository-directory>
Set Up Virtual Environment
bash
python3 -m venv venv
source ./venv/bin/activate
Run the Tmux Script
bash
./tmux.sh

    This script starts all servers (SMTP, Redis, Celery worker) and virtual environments in a single tmux session.
    Navigate between tmux panes using Ctrl+b followed by 1, 2, 3, 4, 5, etc.

Install Dependencies

    Ensure the virtual environment is active, then install requirements:

bash

    pip install -r ./Code/requirements.txt
    Initialize Database
        Use SQLite Editor and the create_init_data.py script to set up and pre-populate roles (Admin, Customer, Professional).
    Run the Application
        Follow the tmux session instructions to start the application servers.
        Access the frontend and test APIs as needed.

Demo

Check out the video demo here:

https://drive.google.com/file/d/1av1CUsJis6iRHAYayLmiB_8FxlYblf4/view?usp=sharing

Contributors

    Name: Sivakumar P
    Email: 21f3001256ds@students.iitm.ac.in
    Personal Email: sktrip17@gmail.com
    Mobile Number: +91 9359570029

License

[Add license information if applicable]
Contact

For any issues or contributions, please contact the contributor via the provided email addresses.
