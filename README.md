![Banner](https://user-images.githubusercontent.com/38149391/224549714-ad91a3ef-c056-4a89-ae7e-2c5375b63ff1.png)
![TS](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![NPM](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=Swagger&logoColor=white)

## About

This API renders UBL formatted XML into a human readable format.

## Features

- Render into multiple formats! (PDF, HTML or JSON)
- Multi-language support (English, Chinese, Spanish, Korean, Japanese)
- Render into multiple styles! (Blue, Landscape, Detailed, Summary and High Contrast)
- Comprehensive Error Handling (Invalid UBL, Missing Data)
- Secured access w/ API keys

# Deployment

This service is already deployed for public use. The service is accessible from [this link](https://app-macroservices.masterofcubesau.com/).

# API Documentation

You may find the documentation for our API [here](https://macroservices.masterofcubesau.com/docs)

This repo will deploy into Kubernetes through CI/CD.

## Running Locally

If you would like to run locally:

1. Create a `.local-secrets` directory in the root of the project.
2. Populate the directory with the following files:
   | Filename | Description |
   |--------------------|------------------------------------|
   | `backend-api-key` | The API key for the backend service |
   | `github-client-id` | The client ID for the GitHub OAuth app |
   | `github-client-secret` | The client secret for the GitHub OAuth app |
   | `google-client-id` | The client ID for the Google OAuth app |
   | `google-client-secret` | The client secret for the Google OAuth app |
   | `i18n-nexus-api-key` | The API key for the i18n Nexus service |
   | `mail-pass` | The password for the email account used to send emails |
   | `next-public-cookie-key` | The public key for the Next.js cookie. This can be any random string |
   | `nextauth-secret` | The secret for the NextAuth.js service. This can be any random string |
3. Run the bot with `docker compose up -d --build`.
