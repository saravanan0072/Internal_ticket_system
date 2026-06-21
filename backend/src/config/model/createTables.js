import db from "../init_db.js";
import bcrypt from "bcryptjs";

export const createTables = async () => {
  try {
    await db.query(`create table if not exists userDetails(
     id int primary key auto_increment,
     userName varchar(100) not null,
     email varchar(255) not null UNIQUE,
     password varchar(255) not null,
     role enum('employee','IT_dept_Agent','HR_dept_Agent','Finance_dept_agent', 'Admin_dept_Agent','admin') not null,
     status enum('active','inActive') default 'active',
     created_at timeStamp default current_timestamp
    )`);

    await db.query(`
      ALTER TABLE userDetails AUTO_INCREMENT = 101`);

    const [admin] = await db.query(
      `SELECT id FROM userDetails WHERE role='admin'`,
    );

    if (admin.length === 0) {
      const hashedPassword = await bcrypt.hash("Admin@123", 10);

      await db.query(`INSERT INTO userDetails (userName,email,password,role,status)
       VALUES(?,?,?,?,?)`,
        [
          "System Admin",
          "admin@company.com",
          hashedPassword,
          "admin",
          "active",
        ],
      );

      console.log("Default admin created");
    }

    await db.query(`create table if not exists ticketDetails(
      id int primary key auto_increment,
      title varchar(150) not null,
      description text not null,
      department enum('IT_Dept','HR_Dept','admin_Dept','Finance_Dept') not null,
      urgency_level enum('Low','Medium','High') default 'Low',
      status enum('Open','InProgress','Resolved','Closed','WaitingApproval','ReOpen') default 'Open',
      confirm_status enum('Fixed','Not_Fixed') default 'Not_Fixed',
      employee_id int not null,
      foreign key(employee_id) references userDetails(id) on delete cascade,
      created_at timestamp default current_timestamp,
      updated_at timestamp default current_timestamp on update current_timestamp
      )`);
    console.log("user table is created");
  } catch (err) {
    console.log("db_err", err.message);
  }
};
