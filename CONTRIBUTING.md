# Contributing to Multi-Agent RAG System

Thank you for your interest in contributing to the Multi-Agent RAG System! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)
- Google AI API Key

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/multi-agent-RAG-system.git
   cd multi-agent-RAG-system
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Set up environment variables**:
   ```bash
   cp .env.local.example .env.local
   # Add your GEMINI_API_KEY to .env.local
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

## 🔧 Development Workflow

### Code Quality

We maintain high code quality standards. Before submitting any changes:

1. **Run linting**:
   ```bash
   npm run lint
   npm run lint:fix  # Auto-fix issues
   ```

2. **Format code**:
   ```bash
   npm run format
   ```

3. **Type checking**:
   ```bash
   npm run type-check
   ```

4. **Build verification**:
   ```bash
   npm run build
   ```

### Coding Standards

- **TypeScript**: All new code must be written in TypeScript
- **JSDoc**: Document all public functions and interfaces
- **React**: Use functional components with hooks
- **Naming**: Use descriptive names for variables, functions, and components
- **Comments**: Write clear comments for complex logic

### File Organization

```
multi-agent-RAG-system/
├── components/           # React components
│   ├── icons/           # SVG icon components
│   └── *.tsx           # Component files
├── services/            # Business logic and API calls
├── types.ts            # TypeScript type definitions
├── App.tsx             # Main application component
└── index.tsx          # Application entry point
```

## 📝 Commit Guidelines

### Commit Message Format

Use the conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes

**Examples:**
```bash
feat(routing): add intelligent agent selection logic
fix(security): resolve PII detection false positives
docs(readme): update installation instructions
```

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Clear description** of the issue
2. **Steps to reproduce** the problem
3. **Expected vs actual behavior**
4. **Environment details** (OS, Node.js version, etc.)
5. **Screenshots or logs** if applicable

Use the bug report template when creating an issue.

## 💡 Feature Requests

For new features:

1. **Check existing issues** to avoid duplicates
2. **Describe the problem** the feature would solve
3. **Propose a solution** with technical details
4. **Consider alternatives** and their trade-offs

## 🔧 Technical Contributions

### Adding New Components

1. Create component in appropriate directory
2. Export from `components/index.ts` if public
3. Add TypeScript interfaces
4. Include JSDoc documentation
5. Update related tests

### Modifying the Processing Pipeline

1. Update relevant stages in `types.ts`
2. Modify `geminiService.ts` logic
3. Update UI components if needed
4. Test with various query types
5. Document behavior changes

### Security Considerations

- Never commit API keys or secrets
- Validate all user inputs
- Follow OWASP security guidelines
- Test security features thoroughly

## 🧪 Testing

Currently, the project uses manual testing. When adding features:

1. Test all processing stages
2. Verify error handling
3. Test edge cases and invalid inputs
4. Ensure UI responsiveness
5. Test with different query types

## 📚 Documentation

- Update README.md for user-facing changes
- Document new APIs with JSDoc
- Update type definitions
- Add inline comments for complex logic

## 🤝 Code Review Process

1. **Create a pull request** with descriptive title
2. **Link related issues** in PR description
3. **Request review** from maintainers
4. **Address feedback** promptly
5. **Squash commits** before merging

### Pull Request Checklist

- [ ] Code follows project style guidelines
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] Breaking changes are documented
- [ ] Commits follow conventional format

## 🏷️ Release Process

Releases follow semantic versioning (SemVer):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Documentation**: Check README.md and inline docs

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to the Multi-Agent RAG System! 🎉