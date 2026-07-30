import type {
  HardwarePlatform,
  HardwareTier,
  LocalDeployment,
  LocalHardwareGuide,
  LocalRuntime,
} from "./types";

export function hw(
  tier: HardwareTier,
  platform: HardwarePlatform,
  minRamGb: number,
  exampleDevices: string[],
  opts?: {
    minVramGb?: number;
    minUnifiedMemoryGb?: number;
    notesEn?: string;
    notesPt?: string;
  },
): LocalHardwareGuide {
  return {
    tier,
    platform,
    minRamGb,
    exampleDevices,
    minVramGb: opts?.minVramGb,
    minUnifiedMemoryGb: opts?.minUnifiedMemoryGb,
    notes:
      opts?.notesEn && opts?.notesPt
        ? { en: opts.notesEn, "pt-br": opts.notesPt }
        : undefined,
  };
}

export function localQ4(
  parameterCount: string,
  weightsUrl: string,
  comfortTiers: HardwareTier[],
  hardware: LocalHardwareGuide[],
  opts?: {
    ollamaTag?: string;
    runtimes?: LocalRuntime[];
    quantization?: string;
    tipsEn?: string;
    tipsPt?: string;
  },
): LocalDeployment {
  return {
    parameterCount,
    quantization: opts?.quantization ?? "Q4_K_M (GGUF)",
    runtimes: opts?.runtimes ?? ["ollama", "lmstudio", "llamacpp"],
    ollamaTag: opts?.ollamaTag,
    weightsUrl,
    comfortTiers,
    hardware,
    tips: {
      en:
        opts?.tipsEn ??
        "VRAM/RAM figures assume the listed quantization with a short-to-medium context. Longer context needs more memory.",
      "pt-br":
        opts?.tipsPt ??
        "Os números de VRAM/RAM assumem a quantização listada com contexto curto/médio. Contexto longo precisa de mais memória.",
    },
  };
}

/** Common NVIDIA ladders for dense Q4 models. */
export const nvidiaEntry8 = (extra = "RTX 3060 8GB / RTX 4060 8GB") =>
  hw("entry", "nvidia", 16, [extra, "GTX 1080 Ti 11GB (tight)"], {
    minVramGb: 8,
    notesEn: "Expect slower tokens/sec and shorter context on 8GB cards.",
    notesPt: "Espere menos tokens/s e contexto mais curto em placas de 8GB.",
  });

export const nvidiaMid12 = (extra = "RTX 3060 12GB / RTX 4070 12GB") =>
  hw("mid", "nvidia", 32, [extra, "RTX 3080 10–12GB"], {
    minVramGb: 12,
  });

export const nvidiaHeavy24 = (extra = "RTX 4090 24GB / RTX 3090 24GB") =>
  hw("heavy", "nvidia", 64, [extra, "2× RTX 3090 (split)"], {
    minVramGb: 24,
  });

export const amdMid16 = () =>
  hw("mid", "amd", 32, ["RX 7900 XT 20GB", "RX 6800 XT 16GB"], {
    minVramGb: 16,
    notesEn: "AMD support varies by runtime (llama.cpp / ROCm). Prefer Vulkan or well-tested builds.",
    notesPt: "Suporte AMD varia por runtime (llama.cpp / ROCm). Prefira Vulkan ou builds bem testados.",
  });

export const appleEntry16 = () =>
  hw("entry", "apple", 16, ["MacBook Pro M1/M2 16GB", "Mac mini M2 16GB"], {
    minUnifiedMemoryGb: 16,
    notesEn: "Prefer MLX or llama.cpp Metal. Leave headroom for macOS.",
    notesPt: "Prefira MLX ou llama.cpp Metal. Deixe folga para o macOS.",
  });

export const appleMid32 = () =>
  hw("mid", "apple", 32, ["MacBook Pro M2/M3 Pro 32GB", "Mac Studio M2 Max 32GB"], {
    minUnifiedMemoryGb: 32,
  });

export const appleHeavy64 = () =>
  hw("heavy", "apple", 64, ["Mac Studio M2 Ultra 64GB+", "MacBook Pro M3 Max 64GB"], {
    minUnifiedMemoryGb: 64,
  });

export const cpuOnly = (minRamGb: number, devices: string[]) =>
  hw("entry", "cpu", minRamGb, devices, {
    notesEn: "CPU-only is usable for small models; expect high latency.",
    notesPt: "CPU-only serve para modelos pequenos; espere alta latência.",
  });
