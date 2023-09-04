const { Router } = require('express');
const { Dog, Temperament } = require('../db')
const router = Router();
const { API_KEY } = process.env
const axios = require('axios');   
 
//   --- 👀👀 CONTROLLERS 👀👀 ---
//🟢OBTENER TODOS LOS TEMPERAMENTOS DE DISTINTAS RAZAS🟢
 const getTemperament = async () => {
    const apiT = await axios.get(`https://api.thedogapi.com/v1/breeds?api_key=${API_KEY}`)
    const getBehavior = await apiT.data.map(e => e.temperament)
    
    const string = getBehavior.toString().split(',')
    string.forEach(element => {
      let item = element.trim()
      Temperament.findOrCreate({  
        where:{name: item}
      })  
    }); 
    const foud = await Temperament.findAll()
     return foud
  }  
 
//🟢DONDE ME TRAITO TODO DE LA API🟢
const getApiInfo = async () => {
    const apiUrl = await axios.get(`https://api.thedogapi.com/v1/breeds?api_key=${API_KEY}`);
    
    const apiInfo = await apiUrl.data.map((e) => {
      return {
        id: e.id,
        name: e.name,
        height_min: e.height.metric.slice(0, 2).trim(),
        height_max: e.height.metric.slice(4).trim(),
        weight_min: e.weight.metric.slice(0, 2).trim(),
        weight_max: e.weight.metric.slice(-2).trim(),
        life_span_min: e.life_span.slice(0, 2).trim(),
        life_span_max: e.life_span.slice(4, -6).trim(),
        image: e.image.url,
        temperament: e.temperament
      };
    });
    return apiInfo;  
  };

  //🟢ACA ES DONDE HAGO LA RELACION🟢
  const getDogsDb = async () => {
    return await Dog.findAll({
        include: {
            model: Temperament,
            attributes: ['name'],//Para especificar que columna  de la tabla
            through: {//Se utiliza para especificar la tabla intermedia
                attributes: [],
            }
        }
    });
}
  
  //🟢ACA CONCATENO LO DE LA API Y DE LA DB🟢
  const getAlldogs = async () => { 
    const apiInfo = await getApiInfo();
    const dbInfo = await getDogsDb();
    const infoTotal = apiInfo.concat(dbInfo);
    return infoTotal;
  };


  //    ✅✅✅ GET DE TODOS LOS TEMPERAMENTS ✅✅✅

  router.get("/temperaments", async (req, res) => {
    try {  
     const have = await getTemperament()
     res.status(200).json(have)
     // res.status(200).send('aaaaa')
    } catch (error) {
     res.status(400).json({error: error.message})
    }
 //  })
 });

  //    ✅✅✅ BUSQUEDA POR ID ✅✅✅

  router.get("/dogs/:id", async (req, res) => {
    const id = req.params.id;
    const charactersTotal = await getAlldogs();
    if (id) {//Si existe
      let characterId = await charactersTotal.filter((el) => el.id == id)//filtra el que coincidan
      characterId.length   
      ? res.status(200).json(characterId)
      : res.status(404).json("No se encontro ningun personaje");
    }
  });


  //   ✅✅ BUSQUEDA POR RAZA DE PERRO, DEBE BUSCAR TANTO EN LA api COMO EN basedato  ✅✅
  
  router.get("/dogs", async (req, res) => {
    const name = req.query.name;
    // let charactersTotal = await getApiInfo();
    let charactersTotal = await getAlldogs();
    if (name) {
      let charactersName = await charactersTotal.filter(
        (el) => el.name.toLowerCase().includes(name.toLowerCase()))//Filtra sin importar las Minusculas y mayusculas
        charactersName.length 
        ? res.status(200).send(charactersName)
        : res.status(404).send("No esta el personaje, Sorry");
      } else {
      res.status(200).send(charactersTotal);
    }
  });
  
  //    ✅✅✅ CREACION DE LA RAZA DEL DOGS ✅✅✅

router.post("/dogs", async (req, res) => { 
  const { name, image, height_min, height_max, weight_min, weight_max, createdIndb, temperament, life_span_min, life_span_max } = req.body;
  
  if (!name || !height_min || !height_max || !weight_min || !weight_max || !image || !life_span_min || !life_span_max ) {
    return res.status(400).send({ msg: "Falta enviar datos obligatorios" });
  }      
  try {        
    const dogCreate = await Dog.create({  
      name,
      image,     
      height_min,       
      height_max,      
      weight_min,    
      temperament, 
      weight_max,   
      life_span_min,    
      life_span_max, 
      createdIndb  
    });     
      
    let tempDb = await Temperament.findAll({    
      where: { name: temperament }       
    });    
 
    await dogCreate.addTemperament(tempDb);      
 
    return res.status(201).send({ msg: "Perro creado correctamente" }); 
  } catch (error) {
    console.log(error); 
    return res.status(500).send({ msg: "Error al crear perro" });
  }
});


module.exports = router;
