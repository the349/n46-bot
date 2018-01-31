# Contribution

If you want to contribute or already are a contributor, this is a very valuable read.

## Code Style

This project uses the  [semistandard](https://github.com/feross/standard) style. Please make sure to follow it!

## Database Tree

Our current database format is:  

```JS
{
  roles: { // List of all roles
    roleName: String // is a rolegroups key
  },

  rolegroups: { // List of all role groups
    nogive: Boolean,
    exclusive: Boolean,
    roles: Set
  }
}
```

Update this file if you make changes to it
