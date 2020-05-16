export default {
  "name": "User",
  "table": {
    "name": "user"
  },
  "columns": {
    "id": {
      "type": "int",
      "generated": true,
      "primary": true
    },
    "firstName": {
      "type": "varchar",
      "nullable": false
    },
    "secondName": {
      "type": "varchar",
      "nullable": false
    }
  },
  "relations": {
    "profile": {
      "target": "Profile",
      "inverseSide": "user",
      "type": "one-to-one",
      "joinColumn": true,
      "lazy": true
    }
  }
}
