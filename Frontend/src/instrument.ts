import {useEffect} from 'react';
import * as Sentry from '@sentry/react';
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from 'react-router-dom';

Sentry.init({
  environment: import.meta.env.NODE_ENV,
  denyUrls: ['localhost'],
  enabled: import.meta.env.NODE_ENV === 'production',
  dsn: 'https://48198d994189157e76d2f8d15e4fdec2@o4507339344379904.ingest.us.sentry.io/4507339346214912',
  integrations: [
    // See docs for support of different versions of variation of react router
    // https://docs.sentry.io/platforms/javascript/guides/react/configuration/integrations/react-router/
    Sentry.reactRouterV6BrowserTracingIntegration({
      useEffect,
      useLocation,
      useNavigationType,
      createRoutesFromChildren,
      matchRoutes,
    }),
    Sentry.replayIntegration(),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  tracesSampleRate: 1.0,

  // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: [""],

  // Capture Replay for 10% of all sessions,
  // plus for 100% of sessions with an error
  replaysSessionSampleRate: 0.5,
  replaysOnErrorSampleRate: 1.0,
});