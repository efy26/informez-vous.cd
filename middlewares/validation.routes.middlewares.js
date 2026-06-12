import { request, response } from "express";

export const isAuthenticated = (request, response, next) => {

    if (request.isAuthenticated()) {
        return next();
    }
    response.redirect('/login')
}

export const isAdmin = (request, response, next) => {
    if (request.isAuthenticated() && request.user.role === "administrateur") {
        return next();
    }

    response.redirect('/login')
}

export const isRedacteur = (request, response, next) => {
    if (request.isAuthenticated() && request.user.role === "rédacteur") {
        return next();
    }

   response.redirect('/login')
}