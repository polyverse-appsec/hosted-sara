Polyverse Sara Static Web UI for Boost
======================

# Release Notes

## Version 0.4.0: November 30th, 2023

### New Features
- Results are loaded and stored via `GET /api/files/{source}/{owner}/{project}/{path-base64}/{analysis_type}` and `POST /api/files/{owner}/{project}}/{path-base64}/{analysis_type}`

### Enhancements
- N/A

### Bug Fixes
- Fix endpoint address for get_file_from_uri
- Fix rendering of raw code retrieved from get_file_from_uri

## Version 0.3.1: November 20th, 2023

### New Features
- N/A

### Enhancements
- N/A

### Bug Fixes
- Fixed URI issue preventing GitHub.com file retrieval

## Version 0.3.0: November 16th, 2023

### New Features
- Integrated Boost GitHub App - enabling retrieval of user source files from public and private GitHub.com repos

### Enhancements
- Minor style improvements

### Bug Fixes
- N/A

## Version 0.2.2: November 14th, 2023

### New Features
- N/A

### Enhancements
- Minor style improvements

### Bug Fixes
- N/A

## Version 0.2.0: November 13th, 2023

### New Features
- Chat support with Sara, the Polyverse Boost AI Assistant
- Explain code
- Check account status on any service completion

### Enhancements
- Color stylings for account status
- Support for CORS to process responses

### Bug Fixes
- Fixes for error conditions

## Version 0.1.0: November 12th, 2023

### New Features
- Check account status by request

### Enhancements
- N/A

### Bug Fixes
- N/A