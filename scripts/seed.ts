const {PrismaClient} = require("@prisma/client")

const database = new PrismaClient();


async function  main(){
    try {
        await database.category.createMany({
            data:[
                {name:"Computer Scinece"},
                {name:"Music"},
                {name:"Fitness"},
                {name:"Photgraphy"},
                {name:"Accounting"},
                {name:"Enginering"},
                {name:"Filming"}
            ]
        })

        console.log("Success");
        
        
    } catch (error) {
        console.log("Erorr sedding the databse categories ", error);
        
    }finally{
        await database.$disconnect();
    }
}
main();