# Contributing to FitAI

Thank you for your interest in contributing to FitAI! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Screenshots** (if applicable)
- **Environment details** (OS, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Use case and motivation**
- **Proposed solution**
- **Alternative solutions considered**

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Make your changes**
4. **Write/update tests**
5. **Update documentation**
6. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
7. **Push to the branch** (`git push origin feature/AmazingFeature`)
8. **Open a Pull Request**

## Development Setup

See [INSTALLATION.md](docs/INSTALLATION.md) for detailed setup instructions.

## Coding Standards

### JavaScript/React

- Use ES6+ features
- Follow Airbnb style guide
- Use functional components with hooks
- Meaningful variable and function names
- Add comments for complex logic

### Python

- Follow PEP 8 style guide
- Use type hints
- Write docstrings for functions
- Keep functions small and focused

### Git Commit Messages

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit first line to 72 characters
- Reference issues and pull requests

Examples:
```
feat: Add user profile page
fix: Resolve login authentication issue
docs: Update API documentation
style: Format code with prettier
refactor: Simplify calorie calculation logic
test: Add tests for diet planner
chore: Update dependencies
```

## Testing

### Running Tests

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test

# ML service tests
cd ml-service
pytest
```

### Writing Tests

- Write tests for new features
- Update tests for bug fixes
- Aim for high code coverage
- Test edge cases

## Documentation

- Update README.md for significant changes
- Update API documentation for API changes
- Add JSDoc comments for functions
- Update CHANGELOG.md

## Project Structure

```
fitness-ai-system/
├── client/          # React frontend
├── server/          # Node.js backend
├── ml-service/      # Python ML service
├── docker/          # Docker configurations
├── docs/            # Documentation
└── tests/           # Test files
```

## Review Process

1. **Automated checks** must pass (linting, tests)
2. **Code review** by maintainers
3. **Documentation** review
4. **Testing** on staging environment
5. **Approval** and merge

## Release Process

1. Update version in package.json
2. Update CHANGELOG.md
3. Create release branch
4. Test thoroughly
5. Merge to main
6. Tag release
7. Deploy to production

## Questions?

Feel free to:
- Open an issue
- Join our Discord server
- Email: dev@fitai.com

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project website

Thank you for contributing to FitAI! 🎉
