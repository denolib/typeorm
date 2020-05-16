export default {
  "name": "User",
  "table": {
    "name": "user"
  },
  "columns": {
    "id": {
      "type": "int",
      "primary": true,
      "generated": true
    },
    "firstName": {
      "type": "varchar",
      "nullable": false
    },
    "secondName": {
      "type": "varchar",
      "nullable": false
    }
  }
}
