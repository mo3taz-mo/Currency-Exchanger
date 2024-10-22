# Currency Exchanger

A modern currency exchange application built with Angular 18.

## Prerequisites

- Node.js version 18.17.0 or higher
- Angular CLI version 18.0.0 or higher
- npm version 9.6.7 or higher

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd currency-exchanger
```

2. Install dependencies:
```bash
npm install
```

3. Add your Fixer API key:
   - Get your API key from [Fixer.io](https://fixer.io/)
   - Open `src/app/services/currency.service.ts`
   - Replace `YOUR_FIXER_API_KEY` with your actual API key

## Development Server

Run the development server:
```bash
ng serve
```
Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Build the project for production:
```bash
ng build
```
The build artifacts will be stored in the `dist/` directory.

### Build Options

For production build with optimization:
```bash
ng build --configuration production
```

## Additional Information

- The application uses Angular's standalone components
- Tailwind CSS is used for styling
- Real-time currency conversion is provided through the Fixer API
