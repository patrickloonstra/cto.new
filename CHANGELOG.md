# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-12-11

### Added
- Initial release of day state storage library
- Domain model for daily writing data with date, written, and published fields
- Client-side persistence layer using localStorage
- Custom React hook `useDayStatuses` with CRUD operations
- Serialization and deserialization with versioning support
- Version mismatch guards to prevent data corruption
- Fallback to in-memory storage when localStorage is unavailable
- Comprehensive unit tests with 90%+ coverage
- Full TypeScript support with strict mode
- Example component demonstrating usage

### Features
- **CRUD Operations**: Create, read, update, delete day statuses
- **Automatic Persistence**: Changes automatically saved to localStorage
- **Version Control**: Storage format includes version number for future migrations
- **Error Handling**: Graceful handling of corrupt data and missing localStorage
- **Type Safety**: Full TypeScript types for all operations
- **Date Flexibility**: Accepts both string dates (YYYY-MM-DD) and Date objects
- **React Integration**: Easy-to-use hook that follows React best practices
