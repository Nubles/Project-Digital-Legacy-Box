# The Digital Legacy Box

This project is a secure digital time capsule designed to preserve memories for friends and family. It allows users to curate collections of letters, photos, and videos to be "unlocked" on a future date.

## Project Structure

This repository is a monorepo containing the frontend and backend applications.

- **/frontend**: A React application built with Vite. This contains all the UI components and user-facing logic.
- **/backend**: A Django application that serves as the API for the project. It handles user authentication, data storage, and the unlocking logic for the legacy boxes.

Please refer to the README files within each directory for specific instructions on how to run them.

## Box Release Mechanism

The release of legacy boxes is handled by a custom Django management command. This command needs to be run periodically to check for and release any boxes that have reached their unlock date.

To run the command manually:
```bash
python backend/manage.py release_boxes
```

In a production environment, this command should be scheduled to run automatically, for example, once a day using a `cron` job.

Example cron job to run the command every day at midnight:
```
0 0 * * * /path/to/your/project/env/bin/python /path/to/your/project/backend/manage.py release_boxes
```