import React, { useLayoutEffect } from 'react';
import { redirect } from 'next/navigation';

export class ApiError {
  public statusCode?: number;
  public message: string;

  constructor({ statusCode, message }: ApiError) {
    this.statusCode = statusCode;
    this.message = message;
  }
}
