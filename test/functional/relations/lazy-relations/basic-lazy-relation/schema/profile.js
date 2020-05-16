export default {
  "name": "Profile",
  "table": {
    "name": "profile"
  },
  "columns": {
    "id": {
      "type": "int",
      "generated": true,
      "primary": true
    },
    "country": {
      "type": "varchar",
      "nullable": false
    }
  },
  "relations": {
    "user": {
      "target": "User",
      "inverseSide": "profile",
      "type": "one-to-one",
      "joinColumn": false,
      "lazy": true
    }
  }
}
