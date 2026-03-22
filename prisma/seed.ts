// prisma/seed.ts
// Seed script for MudaFácil — catalog items, trucks, and sample transportadoras

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding MudaFácil database...");

  // ─── Catalog Items ────────────────────────────────────────────────────────

  const items = [
    // ── Quarto ──────────────────────────────────────────────────────────────
    { nome: "Cama de Solteiro", categoria: "quarto", larguraCm: 90, alturaCm: 45, profundidadeCm: 190, pesoKg: 30, volumeM3: 0.77 },
    { nome: "Cama de Casal", categoria: "quarto", larguraCm: 140, alturaCm: 45, profundidadeCm: 190, pesoKg: 45, volumeM3: 1.20 },
    { nome: "Cama Queen", categoria: "quarto", larguraCm: 160, alturaCm: 45, profundidadeCm: 200, pesoKg: 55, volumeM3: 1.44 },
    { nome: "Cama King", categoria: "quarto", larguraCm: 193, alturaCm: 45, profundidadeCm: 203, pesoKg: 65, volumeM3: 1.76 },
    { nome: "Colchão de Solteiro", categoria: "quarto", larguraCm: 88, alturaCm: 25, profundidadeCm: 188, pesoKg: 15, volumeM3: 0.41 },
    { nome: "Colchão de Casal", categoria: "quarto", larguraCm: 138, alturaCm: 25, profundidadeCm: 188, pesoKg: 22, volumeM3: 0.65 },
    { nome: "Guarda-Roupa 3 Portas", categoria: "quarto", larguraCm: 150, alturaCm: 200, profundidadeCm: 52, pesoKg: 70, volumeM3: 1.56 },
    { nome: "Guarda-Roupa 6 Portas", categoria: "quarto", larguraCm: 230, alturaCm: 210, profundidadeCm: 55, pesoKg: 110, volumeM3: 2.66 },
    { nome: "Cômoda 4 Gavetas", categoria: "quarto", larguraCm: 80, alturaCm: 90, profundidadeCm: 45, pesoKg: 25, volumeM3: 0.32 },
    { nome: "Criado-Mudo", categoria: "quarto", larguraCm: 45, alturaCm: 55, profundidadeCm: 40, pesoKg: 8, volumeM3: 0.10 },
    { nome: "Penteadeira", categoria: "quarto", larguraCm: 100, alturaCm: 140, profundidadeCm: 45, pesoKg: 20, volumeM3: 0.63 },
    { nome: "Sapateira", categoria: "quarto", larguraCm: 60, alturaCm: 120, profundidadeCm: 30, pesoKg: 12, volumeM3: 0.22 },

    // ── Sala ────────────────────────────────────────────────────────────────
    { nome: "Sofá 2 Lugares", categoria: "sala", larguraCm: 150, alturaCm: 85, profundidadeCm: 90, pesoKg: 35, volumeM3: 1.15 },
    { nome: "Sofá 3 Lugares", categoria: "sala", larguraCm: 210, alturaCm: 85, profundidadeCm: 90, pesoKg: 50, volumeM3: 1.61 },
    { nome: "Sofá de Canto (L)", categoria: "sala", larguraCm: 250, alturaCm: 85, profundidadeCm: 200, pesoKg: 75, volumeM3: 4.25 },
    { nome: "Poltrona", categoria: "sala", larguraCm: 80, alturaCm: 90, profundidadeCm: 80, pesoKg: 18, volumeM3: 0.58 },
    { nome: "Mesa de Centro", categoria: "sala", larguraCm: 110, alturaCm: 45, profundidadeCm: 60, pesoKg: 15, volumeM3: 0.30 },
    { nome: "Rack para TV", categoria: "sala", larguraCm: 180, alturaCm: 50, profundidadeCm: 40, pesoKg: 25, volumeM3: 0.36 },
    { nome: "Painel para TV", categoria: "sala", larguraCm: 180, alturaCm: 120, profundidadeCm: 30, pesoKg: 20, volumeM3: 0.65 },
    { nome: "Estante", categoria: "sala", larguraCm: 100, alturaCm: 180, profundidadeCm: 35, pesoKg: 30, volumeM3: 0.63 },
    { nome: "TV 50\"", categoria: "sala", larguraCm: 112, alturaCm: 65, profundidadeCm: 8, pesoKg: 12, volumeM3: 0.06 },
    { nome: "Mesa Lateral", categoria: "sala", larguraCm: 50, alturaCm: 55, profundidadeCm: 50, pesoKg: 6, volumeM3: 0.14 },

    // ── Cozinha ─────────────────────────────────────────────────────────────
    { nome: "Geladeira Duplex", categoria: "cozinha", larguraCm: 70, alturaCm: 175, profundidadeCm: 68, pesoKg: 65, volumeM3: 0.83 },
    { nome: "Geladeira Frost Free", categoria: "cozinha", larguraCm: 60, alturaCm: 165, profundidadeCm: 65, pesoKg: 55, volumeM3: 0.64 },
    { nome: "Fogão 4 Bocas", categoria: "cozinha", larguraCm: 52, alturaCm: 86, profundidadeCm: 60, pesoKg: 25, volumeM3: 0.27 },
    { nome: "Fogão 5 Bocas", categoria: "cozinha", larguraCm: 76, alturaCm: 86, profundidadeCm: 60, pesoKg: 32, volumeM3: 0.39 },
    { nome: "Microondas", categoria: "cozinha", larguraCm: 46, alturaCm: 28, profundidadeCm: 37, pesoKg: 12, volumeM3: 0.05 },
    { nome: "Lava-Louças", categoria: "cozinha", larguraCm: 60, alturaCm: 85, profundidadeCm: 60, pesoKg: 40, volumeM3: 0.31 },
    { nome: "Mesa de Jantar 4 Lugares", categoria: "cozinha", larguraCm: 120, alturaCm: 78, profundidadeCm: 80, pesoKg: 25, volumeM3: 0.75 },
    { nome: "Mesa de Jantar 6 Lugares", categoria: "cozinha", larguraCm: 160, alturaCm: 78, profundidadeCm: 90, pesoKg: 35, volumeM3: 1.12 },
    { nome: "Cadeira de Jantar", categoria: "cozinha", larguraCm: 45, alturaCm: 90, profundidadeCm: 45, pesoKg: 5, volumeM3: 0.18 },
    { nome: "Armário de Cozinha Aéreo", categoria: "cozinha", larguraCm: 80, alturaCm: 70, profundidadeCm: 30, pesoKg: 12, volumeM3: 0.17 },

    // ── Escritório ──────────────────────────────────────────────────────────
    { nome: "Mesa de Escritório", categoria: "escritorio", larguraCm: 120, alturaCm: 75, profundidadeCm: 60, pesoKg: 20, volumeM3: 0.54 },
    { nome: "Cadeira de Escritório", categoria: "escritorio", larguraCm: 60, alturaCm: 110, profundidadeCm: 60, pesoKg: 12, volumeM3: 0.40 },
    { nome: "Estante de Livros", categoria: "escritorio", larguraCm: 80, alturaCm: 180, profundidadeCm: 30, pesoKg: 22, volumeM3: 0.43 },
    { nome: "Gaveteiro", categoria: "escritorio", larguraCm: 40, alturaCm: 65, profundidadeCm: 50, pesoKg: 15, volumeM3: 0.13 },
    { nome: "Impressora", categoria: "escritorio", larguraCm: 45, alturaCm: 25, profundidadeCm: 35, pesoKg: 8, volumeM3: 0.04 },
    { nome: "Monitor", categoria: "escritorio", larguraCm: 60, alturaCm: 45, profundidadeCm: 20, pesoKg: 5, volumeM3: 0.05 },

    // ── Caixas ──────────────────────────────────────────────────────────────
    { nome: "Caixa Pequena (Livros)", categoria: "caixas", larguraCm: 35, alturaCm: 30, profundidadeCm: 30, pesoKg: 15, volumeM3: 0.03 },
    { nome: "Caixa Média (Roupas)", categoria: "caixas", larguraCm: 50, alturaCm: 40, profundidadeCm: 40, pesoKg: 12, volumeM3: 0.08 },
    { nome: "Caixa Grande (Utensílios)", categoria: "caixas", larguraCm: 60, alturaCm: 50, profundidadeCm: 50, pesoKg: 18, volumeM3: 0.15 },
    { nome: "Caixa Extra Grande", categoria: "caixas", larguraCm: 70, alturaCm: 60, profundidadeCm: 60, pesoKg: 20, volumeM3: 0.25 },
    { nome: "Caixa de Guarda-Roupa", categoria: "caixas", larguraCm: 50, alturaCm: 100, profundidadeCm: 50, pesoKg: 10, volumeM3: 0.25 },
    { nome: "Caixa de Mudança Padrão", categoria: "caixas", larguraCm: 55, alturaCm: 45, profundidadeCm: 45, pesoKg: 14, volumeM3: 0.11 },
  ];

  console.log(`Creating ${items.length} catalog items...`);

  for (const item of items) {
    await prisma.item.upsert({
      where: {
        id: `seed-${item.nome.toLowerCase().replace(/[\s"]/g, "-").replace(/[()]/g, "")}`,
      },
      update: item,
      create: {
        id: `seed-${item.nome.toLowerCase().replace(/[\s"]/g, "-").replace(/[()]/g, "")}`,
        ...item,
      },
    });
  }

  // ─── Trucks ───────────────────────────────────────────────────────────────

  const caminhoes = [
    {
      id: "seed-fiorino",
      nome: "Fiorino",
      tipo: "fiorino",
      capacidadeM3: 3,
      capacidadeKg: 600,
      comprimentoCm: 180,
      larguraCm: 130,
      alturaCm: 120,
    },
    {
      id: "seed-hr",
      nome: "HR / Bongo",
      tipo: "hr",
      capacidadeM3: 8,
      capacidadeKg: 1500,
      comprimentoCm: 310,
      larguraCm: 180,
      alturaCm: 170,
    },
    {
      id: "seed-tres-quartos",
      nome: "3/4",
      tipo: "tres_quartos",
      capacidadeM3: 15,
      capacidadeKg: 3000,
      comprimentoCm: 450,
      larguraCm: 220,
      alturaCm: 200,
    },
    {
      id: "seed-bau",
      nome: "Baú",
      tipo: "bau",
      capacidadeM3: 25,
      capacidadeKg: 5000,
      comprimentoCm: 600,
      larguraCm: 240,
      alturaCm: 240,
    },
  ];

  console.log(`Creating ${caminhoes.length} trucks...`);

  for (const caminhao of caminhoes) {
    await prisma.caminhao.upsert({
      where: { id: caminhao.id },
      update: caminhao,
      create: caminhao,
    });
  }

  // ─── Transportadoras ──────────────────────────────────────────────────────

  const transportadoras = [
    {
      id: "seed-transporta-sp",
      nome: "Transporta SP",
      notaMedia: 4.5,
      totalAvaliacoes: 328,
      cidade: "São Paulo",
      tiposCaminhao: ["fiorino", "hr", "tres_quartos", "bau"],
    },
    {
      id: "seed-mudancas-express",
      nome: "Mudanças Express",
      notaMedia: 4.2,
      totalAvaliacoes: 156,
      cidade: "São Paulo",
      tiposCaminhao: ["fiorino", "hr", "tres_quartos"],
    },
    {
      id: "seed-carreto-facil",
      nome: "Carreto Fácil",
      notaMedia: 3.8,
      totalAvaliacoes: 89,
      cidade: "Rio de Janeiro",
      tiposCaminhao: ["fiorino", "hr"],
    },
    {
      id: "seed-mega-mudancas",
      nome: "Mega Mudanças",
      notaMedia: 4.7,
      totalAvaliacoes: 512,
      cidade: "Belo Horizonte",
      tiposCaminhao: ["tres_quartos", "bau"],
    },
    {
      id: "seed-frete-seguro",
      nome: "Frete Seguro",
      notaMedia: 4.0,
      totalAvaliacoes: 203,
      cidade: "Curitiba",
      tiposCaminhao: ["hr", "tres_quartos", "bau"],
    },
  ];

  console.log(`Creating ${transportadoras.length} transportadoras...`);

  for (const transportadora of transportadoras) {
    await prisma.transportadora.upsert({
      where: { id: transportadora.id },
      update: transportadora,
      create: transportadora,
    });
  }

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
