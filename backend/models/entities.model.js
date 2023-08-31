const sql = require("./db.js");

class DataObj {
  static createNewRow(data, result) {
    sql.query(`INSERT INTO ${data.table} SET ?`, data.setValues, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      result(null, { id: res.insertId, ...data });
    });
  }

  static findSingleRow(data, result) {
    sql.query(
      `SELECT * FROM ${data.table} WHERE ${data.attribute} ${data.operator} ?`,
      data.value,
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }

        if (res.length) {
          console.log("found entity: ", res[0]);
          result(null, res);
          return;
        }

        // not found entity with the specified attribute
        result({ kind: "not_found" }, null);
      }
    );
  }

  static findAllRows(data, result) {
    sql.query(`SELECT * FROM ${data.table}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log("found entities: ", res);
        result(null, res);
        return;
      }

      // not found entity with the specified attribute
      result({ kind: "not_found" }, null);
    });
  }

  static updateRows(data, result) {
    const subQuery = formQuery(data.setValues);
    sql.query(
      `UPDATE ${data.table} SET ${subQuery} WHERE ${data.attribute} ${data.operator} ?`,
      [data.value],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }

        if (res.affectedRows == 0) {
          // not found entity with the specified attribute
          result({ kind: "not_found" }, null);
          return;
        }

        result(null, { res });
      }
    );
  }
  static deleteRows(data, result) {
    sql.query(
      `DELETE FROM ${data.table} WHERE ${data.attribute} ${data.operator}?`,
      data.value,
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }

        if (res.affectedRows == 0) {
          // not found entity with the specified attribute
          result({ kind: "not_found" }, null);
          return;
        }

        result(null, res);
      }
    );
  }
}

global.formQuery = (keyValuePair) => {
  let jsonStr = "";

  for (const [key, value] of Object.entries(keyValuePair)) {
    if (key !== "id") {
      if (!value) {
        jsonStr += `${key} = null,`;
      } else if (typeof value === "string") {
        jsonStr += `${key} = "${value}",`;
      } else if (typeof value === "number") {
        jsonStr += `${key} = ${value},`;
      }
    }
  }

  jsonStr = jsonStr.slice(0, -1);
  console.log(jsonStr);

  return jsonStr;
};

module.exports = DataObj;
