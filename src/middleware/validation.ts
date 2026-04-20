import { NextRequest, NextResponse } from 'next/server';
import { validationResult, ValidationChain } from 'express-validator';
import logger from '@/utils/logger';

export function validate(validations: ValidationChain[]) {
  return async function (request: NextRequest) {
    try {
      // Run validations
      await Promise.all(validations.map(validation => validation.run(request)));

      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        logger.warn('Validation failed:', errors.array());
        return new NextResponse(
          JSON.stringify({ errors: errors.array() }),
          { status: 400 }
        );
      }

      return NextResponse.next();
    } catch (error) {
      logger.error('Validation middleware error:', error);
      return new NextResponse(
        JSON.stringify({ message: 'Internal server error' }),
        { status: 500 }
      );
    }
  };
}
