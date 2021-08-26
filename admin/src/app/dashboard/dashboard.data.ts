export const countries = [
  {
    name: 'Germany',
    value: 8940000
  },
  {
    name: 'Great Britain',
    value: 5120000
  },
  {
    name: 'France',
    value: 7200000
  }
];

let d = new Date(),
  h = (d.getHours() < 10 ? '0' : '') + d.getHours(),
  m = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes(),
  s = (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();
let time = h + ':' + m + ':' + s;
export const cost = [
  {
    name: 'Product 1',
    series: [
      {
        name: time,
        value: 21632
      }
    ]
  },
  {
    name: 'Product 2',
    series: [
      {
        name: time,
        value: 32632
      }
    ]
  }
];

export const orders = [
  {
    name: 'Orders',
    series: [
      {
        name: '1980',
        value: 21632
      }
    ]
  }
];

export const products = [
  {
    name: 'Product-1',
    value: 69400
  },
  {
    name: 'Product-2',
    value: 59400
  },
  {
    name: 'Product-3',
    value: 82400
  },
  {
    name: 'Product-4',
    value: 73400
  },
  {
    name: 'Product-5',
    value: 25400
  },
  {
    name: 'Product-6',
    value: 23400
  },
  {
    name: 'Product-7',
    value: 49300
  },
  {
    name: 'Product-8',
    value: 55400
  },
  {
    name: 'Product-9',
    value: 37400
  },
  {
    name: 'Product-10',
    value: 65220
  },
  {
    name: 'Product-11',
    value: 79400
  },
  {
    name: 'Product-12',
    value: 58400
  },
  {
    name: 'Product-13',
    value: 41400
  },
  {
    name: 'Product-14',
    value: 37400
  },
  {
    name: 'Product-15',
    value: 33700
  },
  {
    name: 'Product-16',
    value: 42700
  },
  {
    name: 'Product-17',
    value: 52700
  },
  {
    name: 'Product-18',
    value: 62700
  }
];

export const customers = [
  {
    name: 'Customers',
    series: [
      {
        name: '2000',
        value: 34502
      }
    ]
  }
];

export const refunds = [
  {
    name: 'Item-1',
    value: 23701
  },
  {
    name: 'Item-2',
    value: 33701
  },
  {
    name: 'Item-3',
    value: 63701
  },
  {
    name: 'Item-4',
    value: 52701
  },
  {
    name: 'Item-5',
    value: 73701
  },
  {
    name: 'Item-6',
    value: 43701
  },
  {
    name: 'Item-7',
    value: 83701
  },
  {
    name: 'Item-8',
    value: 29701
  },
  {
    name: 'Item-9',
    value: 69701
  },
  {
    name: 'Item-10',
    value: 58701
  },
  {
    name: 'Item-11',
    value: 65701
  },
  {
    name: 'Item-12',
    value: 47701
  },
  {
    name: 'Item-13',
    value: 41701
  },
  {
    name: 'Item-14',
    value: 25701
  },
  {
    name: 'Item-15',
    value: 35701
  }
];

export const disk_space = [
  {
    name: 'Disk C:',
    value: 178
  },
  {
    name: 'Disk D:',
    value: 340
  },
  {
    name: 'Disk E:',
    value: 280
  }
];
