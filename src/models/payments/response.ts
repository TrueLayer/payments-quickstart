import { SingleImmediateProvider } from 'models/payments-api/responses';

export interface Provider extends SingleImmediateProvider {
  enabled: boolean;
}

export interface ProvidersResponse {
  results: Provider[];
}
