const ROLE = {
    ADMIN: 'admin',
    BASIC: 'basic'
}
  
module.exports = {
    ROLE: ROLE,
    users: [
      { id: 1, name: 'Nida', role: ROLE.ADMIN },
      { id: 2, name: 'Aniket', role: ROLE.BASIC },
      { id: 3, name: 'Robin', role: ROLE.BASIC }
    ],
    projects: [
      { id: 1, name: "Nida's Project", userId: 1 },
      { id: 2, name: "Aniket's Project", userId: 2 },
      { id: 3, name: "Robin's Project", userId: 3 }
    ]
}