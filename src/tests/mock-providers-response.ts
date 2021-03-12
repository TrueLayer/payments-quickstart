export default {
  results: [
    {
      provider_id: 'oauth-starling',
      logo_url: 'https://logos/oauth-starling.svg',
      icon_url: 'https://icons/oauth-starling.svg',
      display_name: 'Starling',
      country: 'GB',
      divisions: ['retail', 'business'],
      single_immediate_payment_schemes: [
        {
          scheme_id: 'faster_payments_service',
          requirements: [
            {
              auth_flow: {
                types: ['redirect'],
                redirect: {}
              },
              single_immediate_payment: {
                currency: {
                  supported_currencies: ['GBP']
                },
                beneficiary: {
                  account: {
                    types: ['sort_code_account_number']
                  },
                  name: {
                    mandatory: true,
                    min_length: 1,
                    max_length: 40,
                    regex: '^[^\\(\\)]+$',
                    format: 'any'
                  }
                },
                remitter: {
                  mandatory: false,
                  account: {
                    types: ['sort_code_account_number']
                  },
                  name: {
                    mandatory: false,
                    min_length: 1,
                    max_length: 80,
                    regex: '^[^\\(\\)]+$',
                    format: 'any'
                  }
                },
                references: {
                  types: ['single', 'separate'],
                  single: {
                    mandatory: true,
                    min_length: 1,
                    max_length: 18,
                    regex: "^[a-zA-Z0-9-:()\\.,'\\+ \\?\\/]{1,18}$",
                    format: 'any'
                  },
                  separate: {
                    beneficiary: {
                      mandatory: true,
                      min_length: 1,
                      max_length: 18,
                      regex: "^[a-zA-Z0-9-:()\\.,'\\+ \\?\\/]{1,18}$",
                      format: 'any'
                    },
                    remitter: {
                      mandatory: true,
                      min_length: 1,
                      max_length: 31,
                      regex: "^[a-zA-Z0-9-:()\\.,'\\+ \\?\\/]{1,31}$",
                      format: 'any'
                    }
                  }
                }
              }
            }
          ]
        }
      ],
      release_stage: 'live'
    },
    {
      provider_id: 'ob-aib-corporate',
      logo_url: 'https://logos/aib-corporate.svg',
      icon_url: 'https://icons/aib-corporate.svg',
      display_name: 'AIB Corporate',
      country: 'GB',
      divisions: ['corporate'],
      single_immediate_payment_schemes: [
        {
          scheme_id: 'faster_payments_service',
          requirements: [
            {
              auth_flow: {
                types: ['redirect'],
                redirect: {}
              },
              single_immediate_payment: {
                currency: {
                  supported_currencies: ['GBP']
                },
                beneficiary: {
                  account: {
                    types: ['sort_code_account_number']
                  },
                  name: {
                    mandatory: true,
                    min_length: 1,
                    max_length: 40,
                    regex: '^[^\\(\\)]+$',
                    format: 'any'
                  }
                },
                remitter: {
                  mandatory: false,
                  account: {
                    types: ['sort_code_account_number']
                  },
                  name: {
                    mandatory: false,
                    min_length: 1,
                    max_length: 80,
                    regex: '^[^\\(\\)]+$',
                    format: 'any'
                  }
                },
                references: {
                  types: ['single', 'separate'],
                  single: {
                    mandatory: true,
                    min_length: 1,
                    max_length: 18,
                    regex: "^[a-zA-Z0-9-:()\\.,'\\+ \\?\\/]{1,18}$",
                    format: 'any'
                  },
                  separate: {
                    beneficiary: {
                      mandatory: true,
                      min_length: 1,
                      max_length: 18,
                      regex: "^[a-zA-Z0-9-:()\\.,'\\+ \\?\\/]{1,18}$",
                      format: 'any'
                    },
                    remitter: {
                      mandatory: true,
                      min_length: 1,
                      max_length: 31,
                      regex: "^[a-zA-Z0-9-:()\\.,'\\+ \\?\\/]{1,31}$",
                      format: 'any'
                    }
                  }
                }
              }
            }
          ]
        }
      ],
      release_stage: 'live'
    },
    {
      provider_id: 'ob-barclays',
      logo_url: 'https://logos/barclays.svg',
      icon_url: 'https://icons/barclays.svg',
      display_name: 'Barclays',
      country: 'GB',
      divisions: ['retail'],
      single_immediate_payment_schemes: [
        {
          scheme_id: 'faster_payments_service',
          requirements: [
            {
              auth_flow: {
                types: ['redirect'],
                redirect: {}
              },
              single_immediate_payment: {
                currency: {
                  supported_currencies: ['GBP']
                },
                beneficiary: {
                  account: {
                    types: ['sort_code_account_number']
                  },
                  name: {
                    mandatory: true,
                    min_length: 1,
                    max_length: 40,
                    regex: '^[^\\(\\)]+$',
                    format: 'any'
                  }
                },
                remitter: {
                  mandatory: false,
                  account: {
                    types: ['sort_code_account_number']
                  },
                  name: {
                    mandatory: false,
                    min_length: 1,
                    max_length: 80,
                    regex: '^[^\\(\\)]+$',
                    format: 'any'
                  }
                },
                references: {
                  types: ['single', 'separate'],
                  single: {
                    mandatory: true,
                    min_length: 1,
                    max_length: 18,
                    regex: "^[a-zA-Z0-9-:()\\.,'\\+ \\?\\/]{1,18}$",
                    format: 'any'
                  },
                  separate: {
                    beneficiary: {
                      mandatory: true,
                      min_length: 1,
                      max_length: 18,
                      regex: "^[a-zA-Z0-9-:()\\.,'\\+ \\?\\/]{1,18}$",
                      format: 'any'
                    },
                    remitter: {
                      mandatory: true,
                      min_length: 1,
                      max_length: 31,
                      regex: "^[a-zA-Z0-9-:()\\.,'\\+ \\?\\/]{1,31}$",
                      format: 'any'
                    }
                  }
                }
              }
            }
          ]
        }
      ],
      release_stage: 'live'
    },
    {
      provider_id: 'ob-barclays-business',
      logo_url: 'https://logos/barclays.svg',
      icon_url: 'https://icons/barclays.svg',
      display_name: 'Barclays Business',
      country: 'GB',
      divisions: ['business'],
      single_immediate_payment_schemes: [
        {
          scheme_id: 'faster_payments_service',
          requirements: [
            {
              auth_flow: {
                types: ['redirect'],
                redirect: {}
              },
              single_immediate_payment: {
                currency: {
                  supported_currencies: ['GBP']
                },
                beneficiary: {
                  account: {
                    types: ['sort_code_account_number']
                  },
                  name: {
                    mandatory: true,
                    min_length: 1,
                    max_length: 40,
                    regex: '^[^\\(\\)]+$',
                    format: 'any'
                  }
                },
                remitter: {
                  mandatory: false,
                  account: {
                    types: ['sort_code_account_number']
                  },
                  name: {
                    mandatory: false,
                    min_length: 1,
                    max_length: 80,
                    regex: '^[^\\(\\)]+$',
                    format: 'any'
                  }
                },
                references: {
                  types: ['single', 'separate'],
                  single: {
                    mandatory: true,
                    min_length: 1,
                    max_length: 18,
                    regex: "^[a-zA-Z0-9-:()\\.,'\\+ \\?\\/]{1,18}$",
                    format: 'any'
                  },
                  separate: {
                    beneficiary: {
                      mandatory: true,
                      min_length: 1,
                      max_length: 18,
                      regex: "^[a-zA-Z0-9-:()\\.,'\\+ \\?\\/]{1,18}$",
                      format: 'any'
                    },
                    remitter: {
                      mandatory: true,
                      min_length: 1,
                      max_length: 31,
                      regex: "^[a-zA-Z0-9-:()\\.,'\\+ \\?\\/]{1,31}$",
                      format: 'any'
                    }
                  }
                }
              }
            }
          ]
        }
      ],
      release_stage: 'live'
    },
    {
      provider_id: 'ob-boi',
      logo_url: 'https://logos/boi.svg',
      icon_url: 'https://icons/boi.svg',
      display_name: 'Bank of Ireland',
      country: 'GB',
      divisions: ['retail', 'business', 'corporate'],
      single_immediate_payment_schemes: [
        {
          scheme_id: 'faster_payments_service',
          requirements: [
            {
              auth_flow: {
                types: ['redirect'],
                redirect: {}
              },
              single_immediate_payment: {
                currency: {
                  supported_currencies: ['GBP']
                },
                beneficiary: {
                  account: {
                    types: ['sort_code_account_number']
                  },
                  name: {
                    mandatory: true,
                    min_length: 1,
                    max_length: 40,
                    regex: '^[^\\(\\)]+$',
                    format: 'any'
                  }
                },
                remitter: {
                  mandatory: false,
                  account: {
                    types: ['sort_code_account_number']
                  },
                  name: {
                    mandatory: false,
                    min_length: 1,
                    max_length: 80,
                    regex: '^[^\\(\\)]+$',
                    format: 'any'
                  }
                },
                references: {
                  types: ['single', 'separate'],
                  single: {
                    mandatory: true,
                    min_length: 1,
                    max_length: 18,
                    regex: "^[a-zA-Z0-9-:()\\.,'\\+ \\?\\/]{1,18}$",
                    format: 'any'
                  },
                  separate: {
                    beneficiary: {
                      mandatory: true,
                      min_length: 1,
                      max_length: 18,
                      regex: "^[a-zA-Z0-9-:()\\.,'\\+ \\?\\/]{1,18}$",
                      format: 'any'
                    },
                    remitter: {
                      mandatory: true,
                      min_length: 1,
                      max_length: 31,
                      regex: "^[a-zA-Z0-9-:()\\.,'\\+ \\?\\/]{1,31}$",
                      format: 'any'
                    }
                  }
                }
              }
            }
          ]
        }
      ],
      release_stage: 'live'
    },
    {
      provider_id: 'ob-bos',
      logo_url: 'https://logos/bos.svg',
      icon_url: 'https://icons/bos.svg',
      display_name: 'Bank of Scotland',
      country: 'GB',
      divisions: ['retail'],
      single_immediate_payment_schemes: [
        {
          scheme_id: 'faster_payments_service',
          requirements: [
            {
              auth_flow: {
                types: ['redirect'],
                redirect: {}
              },
              single_immediate_payment: {
                currency: {
                  supported_currencies: ['GBP']
                },
                beneficiary: {
                  account: {
                    types: ['sort_code_account_number']
                  },
                  name: {
                    mandatory: true,
                    min_length: 1,
                    max_length: 40,
                    regex: '^[^\\(\\)]+$',
                    format: 'any'
                  }
                },
                remitter: {
                  mandatory: false,
                  account: {
                    types: ['sort_code_account_number']
                  },
                  name: {
                    mandatory: false,
                    min_length: 1,
                    max_length: 80,
                    regex: '^[^\\(\\)]+$',
                    format: 'any'
                  }
                },
                references: {
                  types: ['single', 'separate'],
                  single: {
                    mandatory: true,
                    min_length: 1,
                    max_length: 18,
                    regex: "^[a-zA-Z0-9-:()\\.,'\\+ \\?\\/]{1,18}$",
                    format: 'any'
                  },
                  separate: {
                    beneficiary: {
                      mandatory: true,
                      min_length: 1,
                      max_length: 18,
                      regex: "^[a-zA-Z0-9-:()\\.,'\\+ \\?\\/]{1,18}$",
                      format: 'any'
                    },
                    remitter: {
                      mandatory: true,
                      min_length: 1,
                      max_length: 31,
                      regex: "^[a-zA-Z0-9-:()\\.,'\\+ \\?\\/]{1,31}$",
                      format: 'any'
                    }
                  }
                }
              }
            }
          ]
        }
      ],
      release_stage: 'live'
    },
    {
      provider_id: 'ob-bos-business',
      logo_url: 'https://logos/bos.svg',
      icon_url: 'https://icons/bos.svg',
      display_name: 'Bank of Scotland Business',
      country: 'GB',
      divisions: ['business'],
      single_immediate_payment_schemes: [
        {
          scheme_id: 'faster_payments_service',
          requirements: [
            {
              auth_flow: {
                types: ['redirect'],
                redirect: {}
              },
              single_immediate_payment: {
                currency: {
                  supported_currencies: ['GBP']
                },
                beneficiary: {
                  account: {
                    types: ['sort_code_account_number']
                  },
                  name: {
                    mandatory: true,
                    min_length: 1,
                    max_length: 40,
                    regex: '^[^\\(\\)]+$',
                    format: 'any'
                  }
                },
                remitter: {
                  mandatory: false,
                  account: {
                    types: ['sort_code_account_number']
                  },
                  name: {
                    mandatory: false,
                    min_length: 1,
                    max_length: 80,
                    regex: '^[^\\(\\)]+$',
                    format: 'any'
                  }
                },
                references: {
                  types: ['single', 'separate'],
                  single: {
                    mandatory: true,
                    min_length: 1,
                    max_length: 18,
                    regex: "^[a-zA-Z0-9-:()\\.,'\\+ \\?\\/]{1,18}$",
                    format: 'any'
                  },
                  separate: {
                    beneficiary: {
                      mandatory: true,
                      min_length: 1,
                      max_length: 18,
                      regex: "^[a-zA-Z0-9-:()\\.,'\\+ \\?\\/]{1,18}$",
                      format: 'any'
                    },
                    remitter: {
                      mandatory: true,
                      min_length: 1,
                      max_length: 31,
                      regex: "^[a-zA-Z0-9-:()\\.,'\\+ \\?\\/]{1,31}$",
                      format: 'any'
                    }
                  }
                }
              }
            }
          ]
        }
      ],
      release_stage: 'live'
    }
  ]
};
