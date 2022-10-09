import { PrismaClient } from "@prisma/client"
import express from "express"
import cors from "cors"

const app = express()

app.use(express.json())
app.use(cors())

const prisma = new PrismaClient({
    log: ['query']
})

app.get('/games', async (request, response) => {
    const games = await prisma.game.findMany({
        include: {
            _count: {
                select: {
                    ads: true
                }
            }
        }
    });

    return response.status(200).json(games)
})

app.post('/ads', async (request, response) => {
    const body = request.body;

    const ad = await prisma.ad.create({
        data: {
            gameId: body.gameId,
            name: body.name,
            yearsPlaying: body.yearsPlaying,
            discord: body.discord,
            weekDays: body.weekDays.join(','),
            hourStart: body.hourStart,
            hourEnd: body.hourEnd,
            useVoiceChannel: body.useVoiceChannel
        }
    })

    return response.status(201).json(ad)
})

app.get('/games/:id/ads', async (request, response) => {
    const gameId = request.params.id;

    const ads = await prisma.ad.findMany({
        where: {
            gameId,
        }
    })

    return response.status(200).json(ads.map(ad => {
        return {
            ...ad,
            weekDays: ad.weekDays.split(',')
        }
    }))
})

app.get('/ads/:id/discord', async (request, response) => {
    const adId = request.params.id;

    const ad = await prisma.ad.findUniqueOrThrow({
        select: {
            discord: true,
        },
        where: {
            id: adId,
        }
    })

    return response.status(200).json({
        discord: ad.discord
    })
})

app.listen(3333)