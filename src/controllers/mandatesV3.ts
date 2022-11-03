import { NextFunction, Request, Response } from 'express';
import { HttpException } from 'middleware/errors';
import config from 'config';
import AuthenticationClient from 'clients/authentication-client';
import MandatesClient from 'clients/mandatev3-client';
import { CreateMandateRequest, createMandateRequestSchema } from 'models/v3/payments-api/create_mandates';
import { CurrencyCode, PeriodAlignment } from '../models/v3/payments-api/mandate_common';

export default class MandatesV3Controller {
  private mandatesClient = new MandatesClient(new AuthenticationClient());

  createMandate = async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body || {};
    const baseBody = { ...this.generateMandate(), ...body };
    try {
      const validate = createMandateRequestSchema.safeParse(baseBody);
      if (!validate.success) {
        throw new HttpException(400, `Invalid request: ${validate.error}`);
      }

      const response = await this.mandatesClient.initiateMandate(baseBody);

      res.status(200).send(response);
    } catch (e) {
      next(e instanceof HttpException ? e : new HttpException(500, 'Failed to initiate mandate.'));
    }
  };

  getMandate = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      return next(new HttpException(400, 'Expected `id` parameter.'));
    }

    try {
      const response = await this.mandatesClient.getMandate(id);
      res.status(200).send(response);
    } catch (e) {
      next(e instanceof HttpException ? e : new HttpException(500, `Failed to retrieve mandate: ${id}.`));
    }
  };

  generateMandate(): CreateMandateRequest {
    return {
      metadata: {},
      constraints: {
        maximum_individual_amount: 1,
        periodic_limits: {
          month: {
            maximum_amount: 1,
            period_alignment: PeriodAlignment.Calendar
          }
        }
      },
      currency: CurrencyCode.GBP,
      user: {
        name: 'John Doe',
        email: 'jhondoe@tester.com'
      },
      mandate: {
        type: 'sweeping',
        provider_selection: config.PROVIDER_ID_PRESELECTED
              ? {
                  type: 'preselected',
                  provider_id: config.PROVIDER_ID_PRESELECTED,
                }
              : {
                  type: 'user_selected',
                },
        beneficiary: {
          type: 'external_account',
          account_holder_name: 'Ted Smith',
          account_identifier: {
            type: 'sort_code_account_number',
            sort_code: '112233',
            account_number: '12345678'
          }
        }
      }
    };
  }
}
