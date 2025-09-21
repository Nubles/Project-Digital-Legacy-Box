# Agent Instructions & Technical Choices

This document outlines the key technical decisions made for this project for future reference by engineering agents.

## Technology Stack

- **Backend**: Django
  - **Reasoning**: The project brief emphasizes security and reliability. Django is a mature, "batteries-included" framework with a strong security track record, a built-in ORM, and robust features that are well-suited for the requirements of the Digital Legacy Box.

- **Frontend**: React (with Vite)
  - **Reasoning**: React is a popular and powerful library for building modern user interfaces. Using Vite as the build tool provides a fast development experience and an optimized production build. This choice aligns with the need for a clean, responsive, and intuitive UI as specified in the brief.

- **Database**: PostgreSQL
  - **Reasoning**: As recommended in the project brief, PostgreSQL is a reliable, scalable, and feature-rich open-source relational database that is a good fit for the structured data this application will handle.

## Project Structure

The project is set up as a monorepo with two main directories:
- `frontend/`: Contains the React client application.
- `backend/`: Contains the Django API server.
