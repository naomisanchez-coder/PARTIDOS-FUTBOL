function calcularPuntos(pred, resultadoReal, rachaActual, fechaPrediccion, fechaPartido) {
    let puntos = 0;
    let acertoGanador = false;

    const realGolesLocal = resultadoReal.goles_local;
    const realGolesVisitante = resultadoReal.goles_visitante;
    const predLocal = pred.pred_goles_local;
    const predVisitante = pred.pred_goles_visitante;

    const ganadorReal = realGolesLocal > realGolesVisitante ? 1 : (realGolesLocal < realGolesVisitante ? 2 : 0);
    const ganadorPred = predLocal > predVisitante ? 1 : (predLocal < predVisitante ? 2 : 0);

    // Regla 1: Resultado exacto (5 puntos)
    if (predLocal === realGolesLocal && predVisitante === realGolesVisitante) {
        puntos += 5;
        acertoGanador = true;
    } 
    // Regla 2: Ganador / Empate correcto (3 puntos)
    else if (ganadorReal === ganadorPred) {
        puntos += 3;
        acertoGanador = true;
    }

    // Regla 3: Diferencia de goles correcta (2 puntos)
    const difReal = realGolesLocal - realGolesVisitante;
    const difPred = predLocal - predVisitante;
    if (ganadorReal === ganadorPred && difReal === difPred && !(predLocal === realGolesLocal && predVisitante === realGolesVisitante)) {
        puntos += 2;
    }

    // Regla 4: Bonus por racha (+2 puntos cada 3 partidos consecutivos acertados)
    let nuevaRacha = rachaActual;
    if (acertoGanador) {
        nuevaRacha += 1;
        if (nuevaRacha % 3 === 0) {
            puntos += 2;
        }
    } else {
        nuevaRacha = 0;
    }

    // Regla 5: Predicción anticipada (+1 punto extra si es > 24 hrs antes)
    const horasDiferencia = (new Date(fechaPartido) - new Date(fechaPrediccion)) / (1000 * 60 * 60);
    if (horasDiferencia > 24) {
        puntos += 1;
    }

    return { puntos, nuevaRacha };
}

module.exports = { calcularPuntos };
