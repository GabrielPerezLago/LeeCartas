
db = db.getSiblingDB('cartas');

db.carta.insertMany(
    [
        {
            nombre: "pan",
            id_rareza: 1,
            poder: 50, velocidad: 10
        }, 
        { 
            nombre: "paco", 
            id_rareza: 3,
            poder: 100, 
            velocidad: 40 
        }, 
        { 
            nombre: "duende",
            id_rareza: 2, 
            poder: 10, 
            velocidad: 10 
        }, 
        { 
            nombre: "orco", 
            id_rareza: 1, 
            poder: 80, 
            velocidad: 50 
        }
    ]
);
db.rareza.insertMany(
    [
        {
            _id: 1,
            tipo: "comun" 
        }, 
        {
            _id: 2,
            tipo: "poco comun"
        },
        { 
            _id: 3,
            tipo: "rara" 
        }, 
        { 
            _id: 4,
            tipo: "legendaria" 
        }
    ]
);

db.carta.aggregate([
  {
    $lookup: {
      from: "rareza",
      localField: "id_rareza",
      foreignField: "_id",
      as: "rareza"
    }
  },
  {
    $unwind: "$rareza"
  }
]);
