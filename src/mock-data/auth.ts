export const authMock = {
  roles: ["موظف", "أدمن"] as const,
  employees: [
    { username: "emp1", password: "1234", role: "موظف" as const, profileName: "أحمد" },
  ],
  admins: [
    { username: "admin", password: "1234", role: "أدمن" as const, profileName: "HR Admin" },
  ],
};

