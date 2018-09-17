import React from 'react';

import { EmptyState, Page } from '@shopify/polaris';

export default function NotFound() {
  return (
    <Page>
      <EmptyState
        heading="The page you're looking for couldn't be found"
        action={{ content: 'Back to index', url: '/' }}
        image="/static/WrcV-404.svg"
      >
        <p>Check the web address and try again.</p>
      </EmptyState>
    </Page>
  );
}
