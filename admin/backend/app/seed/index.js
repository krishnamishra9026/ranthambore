/* eslint no-console: ["off"] */

import User from '../models/user.model';
import Role from '../models/roles.model';
import Capabilities from '../models/capabilities.model';
import utils from '../utils';
import config from '../config';

function getUsers(superadminRole, admin) {
  const users = [
    {
      roleId: superadminRole,
      firstName: 'super',
      lastName: 'admin',
      gender: 'male',
      email: 'super@admin.com',
      password: 'admin@123',
      status: 'Active',
    },
    {
      roleId: admin,
      firstName: 'sub',
      lastName: 'admin',
      gender: 'male',
      email: 'sub@admin.com',
      password: 'admin@123',
      status: 'Active',
    },
  ];
  return users;
}

const Roles = [
  {
    name: 'Super Admin',
    slug: 'super_admin',
    capabilities: [],
  },
  {
    name: 'Admin',
    slug: 'admin',
    capabilities: [],
  },
];

export default function seed() {
  let allModules = [];
  const capabilities = [];

  if (config.modules.length) {
    allModules = config.modules;
  }

  allModules.forEach(module => {
    module.fields.forEach(key => {
      const name = `${key.charAt(0).toUpperCase()}${key.substr(1)} ${module.name}`;
      const slug = utils.sanitizeUniqueName(name);
      Roles[0].capabilities.push(slug);
      capabilities.push({
        module: module.name,
        name,
        slug,
      });
    });
  });

  return Capabilities.deleteMany({})
    .then(() => {
      console.log('Capabilities data cleared successfully!');
      return Capabilities.create(capabilities)
        .then(() => {
          console.log('Capabilities added successfully!');
          return Role.deleteMany({})
            .then(isDeleted => {
              if (isDeleted) {
                console.log('Roles data cleared successfully!');
                Role.create(Roles)
                  .then(roles => {
                    User.deleteMany({}).then(isRemoved => {
                      if (isRemoved) {
                        console.log('User data cleared successfully!');
                        const users = getUsers(roles[0].id, roles[1].id);
                        User.create(users)
                          .then(() => {
                            console.log('Seed script executed successfully.');
                          })
                          .catch(err => {
                            console.log('Error ocurred while creating user from seed!');
                            console.log(err);
                          });
                      }
                    });
                  })
                  .catch(err => {
                    console.log('Error ocurred while creating roles from seed!', err);
                  });
              }
            })
            .catch(() => {
              console.log('Error ocurred while removing roles!');
            });
        })
        .catch(() => console.log('Error ocurred while creating capabilities!'));
    })
    .catch(() => {
      console.log('Error ocurred while removing capabilities!');
    });
}
