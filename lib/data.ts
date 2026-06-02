export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  currency: 'INR' | 'USD';
  rating?: string;
  brand?: string;
  category: string;
  image: string;
  thumbnails?: string[];
  inStock: boolean;
  tag?: string;
  badge?: string;
  specifications?: Record<string, string>;
  description?: string;
  bulletPoints?: string[];
}

export const PRODUCTS_CATALOG: Product[] = [
  // New Arrivals
  {
    id: "premium-minimalist-watch",
    name: "Premium Minimalist Watch",
    price: 4999,
    currency: "INR",
    category: "Fashion & Apparel",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFzlRbT6_nmwjpaSJDECDtsEL3fjq_wt3Di_tS3nlQiyf84e2M2xCu-xwW83K9FMupuTW13s_o8WM4u2W-q2h-whBZZrtkyATG309WVxD_EmOKHAz_x3OXPx34JJ0TPu0tL3dXbdoOQcYxeq_8o0pABK4BkOPcPXJzKSqYlAysIcRUXawVMoQVormzZaod7gbVAdKSppgJe42Y4JCCM5SXK4ff1vwhwOzU4BNkFr0TTqlCZVFAaTRiaOAfCB0mW2ODl-oew_NHbb14",
    inStock: true,
    badge: "New",
    brand: "Sarvam Signature",
    description: "A sleek, minimalist watch set against a clean aesthetic. Defined by precision metallic textures, premium leather straps, and an elegant watch head designed for timeless expression.",
    specifications: {
      "Case Diameter": "40mm",
      "Movement": "Japanese Quartz",
      "Strap Material": "Genuine Calfskin Suede",
      "Water Resistance": "5 ATM"
    }
  },
  {
    id: "studio-wireless-pro",
    name: "Studio Wireless Pro",
    price: 12499,
    currency: "INR",
    category: "Electronics",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCmPgr3rrbebMz2UJA6tV2zC7fIC97n5HDFDvrKLP_16eXy8xjjCDopuzwbRR93Qtt0nhij0OWHRyRti2lkiGLXALY0Sb_OEa-f7AtdrTHiu6BnVTHk8BJtlUNne973bqILfnU4A2BpWU-BMXk4FhaECq1sfN9d4Jo3rIQ3MHYwufoHvoMhXGcilu9gRRUyXt5w6pFWnvYVJv3R-5rymBnMmo42xdk7A0xsoNvpMvolz9iD-s9ISVYUVxDsgAT6NbBTCYoy3YiRV9xQ",
    inStock: true,
    brand: "Minimalist Co.",
    description: "Experience absolute high-fidelity sounds with state-of-the-art hybrid noise cancelling, soft memory earmuffs, and custom dynamic audio tuning.",
    specifications: {
      "Battery Life": "Up to 45 Hours",
      "Drivers": "40mm Beryllium High-Res",
      "Connectivity": "Bluetooth 5.3 & AUX",
      "Weight": "250g"
    }
  },
  {
    id: "elite-velocity-runner",
    name: "Elite Velocity Runner",
    price: 7299,
    currency: "INR",
    category: "Fashion & Apparel",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuATMi-lRrjRT8QsXeBpbAw4mRpqhpHIItzMRPH0Y6cJfSYukFSYkBj45-AMupdrUaaIpol01GrYNe5_WRSRVeU5TsOGA1P2juABlbpHvlqFd-CZxNWSQQNDP_--8vaY9RzihWshFSmQaah2ufPMW139dEMg2Nlpht33iKInNnGRGfrN34eRlspRY76D2H7jZhgZRrZSQc9jUMh6RItgARWgR8-L4sYM8XrX34pglxxVRtaNtTs5qjo3pASV09Nbg8AY6qhcnpP_HbpU",
    inStock: true,
    brand: "Urban Loft",
    description: "Designed for explosive strides and unmatched comfort. Lightweight breathable knit mesh keeps things ventilated while the custom carbon plate drives you forward.",
    specifications: {
      "Weight": "190g",
      "Midsole": "Superfoam Energy Return",
      "Drop": "8mm",
      "Fit": "True to size"
    }
  },
  {
    id: "aviator-classic-series",
    name: "Aviator Classic Series",
    price: 2999,
    currency: "INR",
    category: "Fashion & Apparel",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGh-rmXRZKkpgi0r5-XfYeYqmtyVemXdxWmdXAkLX9gyzmVABtBfrd9rFeetdhzyU0wFLSbhJl2PR3tEbry59Vdv1ASK_gF9XQA5T66ohMHhK3i83McjzsjfKrC_44H6KK4sAF5H0kbcAkvy8GLRPhKmACwPB2bVVuOW4ayYPb9DPewYOSYN-gyECzjMpAeZ4DH3q1Cmb80bHBF6sx408lpWMiZmTFNR8Hwi2PggeJ3USjsvOxj5UPRivXhWmGoYXcYC3jXDYRIvDA",
    inStock: true,
    brand: "Urban Loft",
    description: "Elegant polarized gold sunglasses offering flawless military-grade frame layout, light filtering, and complete UV safety in a timeless silhouette.",
    specifications: {
      "Lenses": "Polarized UV400",
      "Frame Type": "Full Rim Stainless Alloy",
      "Width": "142mm",
      "Temples": "145mm"
    }
  },
  {
    id: "vantage-x-pro-max",
    name: "Vantage X Pro Max",
    price: 89999,
    currency: "INR",
    category: "Electronics",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDy7976Mtd2nvbeTdkTl6Nyy2sbiMP_HQId5uav8dPctV0Z_jECmnzfaNce2SvOFpMV65SR94DcDgTzAAYky0SRNvzL2rPn10_Ln6InWLlB1xoJUsGpnLsqYxUGpU23xCh22PCn7S4P_XdneOH1_ZhKoP-rDjfdY6yhczE17vNZNsaRcMlj2ppZACEtQyPcwpF9HwtnkpbSSaimSmCbPFnNO63DzCMo3lt8ICw5jUoi0adYstKilf0Sc6y-bx8DOql1GmbF-Vrclhul",
    inStock: true,
    brand: "Minimalist Co.",
    description: "The ultimate edge in smartphone performance. Liquid smooth 120Hz display, a studio-grade triple camera sensor array, and durable premium brushed titanium bands.",
    specifications: {
      "Screen Type": "ProMotion OLED 6.7\"",
      "Processor": "Aero chip Tensor Pro",
      "Camera": "48MP Main, 12MP Tele, 12MP Ultra",
      "Battery": "5000 mAh Fast Charge"
    }
  },
  
  // Trending Section
  {
    id: "retro-digital-slr",
    name: "Retro-Digital SLR",
    price: 54999,
    currency: "INR",
    category: "Electronics",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD8XmTm-DFDRNLbG0D6vpWXt7c1Wnr3oKDXCyuiOB8LnwXR3qif88hNQ1XXNDgz1o8w_nhGODHrmP7D5kOe1Z4MkilLu8DvOT06RD7zbj1y-iUhujJxSwGij5RGM9MbuzGaNzeQJdxnkFzabzI8WggC_5m4pWKZwMWtQPgzEXy2meg5fozhEeVn7y48xxeUoKxPhWvfVnUfm2qHwTEO35GrLzxXqnztQNprkckbUwdT6coJILaxghPrW464muZqcEJGKrrMq_0d2SBg",
    inStock: true,
    brand: "Sarvam Signature",
    description: "Classic styling meets advanced digital optics. Immersive optical dials and custom leather handgrips surrounding an ultra-sharp mirrorless sensor.",
    specifications: {
      "Sensor": "26.1MP APS-C X-Trans",
      "Video Mode": "4K at 60fps",
      "Autofocus": "Hybrid Phase Detection",
      "Lens Mount": "X-Mount compatible"
    }
  },
  {
    id: "essence-de-nuit-perfume",
    name: "Essence de Nuit Perfume",
    price: 8499,
    currency: "INR",
    category: "Personal Care",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB3T9TC1M9cdKPw50I-Em-cz87g4qADlnBmvAhMNNwucIJOZg6A6gRNHBjWqUYWLNsMX6PrzJQjtzCMFtsMUD31te9vhz9391mPRIrSJJRw59DDmhoBh3pOk-gO7SqJpMqxGILtks_wzMEvHuiWdoozPpak1WwYuJXsbpHCVcuETMLELbm641P1nYwX-lRncxXlJHr1LTxOBeoymhPQv3yu1D3ieC4IUSFOq23rad5XYWz5_sc1Ag3rYzuGyvAxZBJwQsJLzREYM4tM",
    inStock: true,
    brand: "Pure Silk",
    description: "An evocative, deep, and sensual amber fragrance housed inside an beautiful individually hand-polished clear crystal bottle layout.",
    specifications: {
      "Notes": "Amber, Cedarwood, Vetiver, Cardamom",
      "Classification": "Eau de Parfum",
      "Longevity": "8 to 12 Hours",
      "Volume": "100ml"
    }
  },
  {
    id: "handcrafted-artisan-vase",
    name: "Handcrafted Artisan Vase",
    price: 1499,
    currency: "INR",
    category: "Home Decor",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAF6EoP6vx10hBrYIl87UMJ-p5VLdV5mxM_Lf57lRAdbLgHhlDNrGYYeUoMVQqn7LrwvjfOzywcJyDLFhsy_-tCBJDMa_-MsxW6wx7zwQL-WNyjOFROsO7IBIKaB970iiubYB53flHlHf-xsZxFxHI0WNqU74w4uhAGDIuGGCxef4kqJAhCtH07Xm9FS68dKMcMYSOYBe1bH1AoALhJC1JFFZQfAv_9oSuQJoIcXQ0_KoBJm1apIoxlkFVFzgBR8XOCPClSOciWTaUv",
    inStock: true,
    brand: "Pure Silk",
    description: "Nordic Minimalist textured pottery handmade using raw clay blends, matching natural warm tones and sleek organic curves.",
    specifications: {
      "Clay Type": "Unglazed Stoneware",
      "Finish": "Matte Pale Bone",
      "Height": "24 cm",
      "Diameter": "18 cm"
    }
  },
  {
    id: "zenbook-infinity-14",
    name: "ZenBook Infinity 14",
    price: 114999,
    currency: "INR",
    category: "Electronics",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKpc3tYZEkyj4-2inWNcSOAbUATVxQFsQh8BRGCRtj1IoLvarKAEApnbE22crNmyWuldYhOHLFQAArod3ku3uXmwSRfPuViQwGcC31kAg9YQ6SKLRHQTI1GekoUhGr_oYM8MY5fS5MhGi2uWCbOzNYKy5wwFhY3D-nqqNnVy9HnA0PFZIVBoov09FYo_us6swT4yIPO6pkLJYHBrQ8Hs02kOJPzNSkQ3_iok-GZv7OxHzcqO7OMDhQtQF2DUAFeKeTzWNl728j0SRx",
    inStock: true,
    brand: "Minimalist Co.",
    description: "Incredibly fast and ultra-slim developer powerhouse. Defined by a luxurious 14-inch OLED display, zero-latency key travel, and robust full battery cycles.",
    specifications: {
      "Display": "14-inch 120Hz Lumina OLED",
      "Memory": "32GB LPDDR5X",
      "Storage": "1TB NVMe PCIe 4.0 SSD",
      "CPU": "Core Ultra 7 AI Balanced"
    }
  },
  {
    id: "retro-high-top-suede",
    name: "Retro High-Top Suede",
    price: 8999,
    currency: "INR",
    category: "Fashion & Apparel",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfrBigi5b-KI2I_Aa8ZfpTmQym-GwgStvoBhGxpv8rbqhT3yVF6nyA7e8y8FhV4zRC9Z4IJYnqvVzJXuu-Kg9Yt07f-PJ4FDB51EQVozfWchSqR2vVAioYq985VwafyAOQkLlbSrHrMYAeuIjK30M6gy9ZpO1hbXdcOSnDzum7FbMeEVfBw394dhHFh4jAdw9frm5lH9ry2ffzRwLLo1JiiuI6_fbLNpgdnBBaWk0N7_cM6jhAt6sob_A-acbKzoaKTzNdrbdQkiYL",
    inStock: true,
    brand: "Urban Loft",
    description: "Classic high-topped silhouettes styled with luxurious Italian calfskin suede panels, gold stamped accents, and vulcanized performance gum soles.",
    specifications: {
      "Sole Type": "Vulcanized Gum",
      "Stamping": "Gold foil logo debossed",
      "Liner": "Breathable raw mesh texturing",
      "Padding": "Dual-density active heel cups"
    }
  },

  // Category Filtering Rows (Linen Dress, Running shoes, Chronos smartwatch, Buds, Aviator Gold, Ceramic Vase)
  {
    id: "linen-blend-dress",
    name: "Linen Blend Summer Dress",
    price: 3499,
    originalPrice: 4999,
    currency: "INR",
    category: "Fashion & Apparel",
    brand: "Sarvam Signature",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB5ZAf6ORwvk_iY5Rb8MuYHnL8xfGtbLfGYDHZ0c7fIK5DxzRIhVtuQU3coQA7UAtgOSS4osb5SvOHPtxClBZJ2_Ofd0aRzcb6QHQeAsL4i3KQUvTBFBSnfnzbNg2aGCDWdoTTjHdz6Vz3Z3j821R9KrqIE0vy5TvNRas3pr4zz9dB8Ti2Qd4uo4707UNiFtaZ4Kk2bYYmz1fiCQwIS8fGrHcsC3T_AzEb1_jbHvgrkkM4go2EGgJfEDfcX4bBXbwajRw7uKsAuLMYa",
    inStock: true,
    description: "Designed with an open breathable structural outline. Heavy-weight organic linen weave blends drape elegantly, feeling airy and pure.",
    specifications: {
      "Material": "80% Organic Linen, 20% Blend",
      "Weave": "Traditional heavyweight breathable",
      "Fit": "Relaxed elegant silhouette"
    }
  },
  {
    id: "aero-light-running-shoes",
    name: "Aero-Light Running Shoes",
    price: 2899,
    rating: "4.8 ★",
    currency: "INR",
    category: "Fashion & Apparel",
    brand: "Urban Loft",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZArCEZ-4OUxsjE7nk2KBjalUzkEINS0mI6OERktJdtd0Q8H7O8BdIg6ff-eL9rD6ffPSFD_cJ1WOwtWr8jzcZnVmCfSdx80R9nV8tSn4snUy_TB07G48Zc1JKS4XtibmBgn8-WzMbJFT2YHmU8fZdW7ALF74ngS0u-VNaN1EB6hRXglu1teMh80QpAXEcHYgNbG8Famv4Mn45KdjEcvb5TXf8fyppno2IkKrSjijwd34UlHo2qtU2iBsLcszjJb9_40ocJmgDHwMb",
    inStock: true,
    description: "Sleek crimson red running trainers with dynamic responsive outsoles, ultra-tight knit uppers, and breathable technical sock layouts.",
    specifications: {
      "Drop": "6mm offset",
      "Outsole": "Carbon-injected high grip",
      "Structure": "Inner elastic sock layout"
    }
  },
  {
    id: "chronos-gen-4-smartwatch",
    name: "Chronos Gen 4 Smartwatch",
    price: 4599,
    tag: "BESTSELLER",
    currency: "INR",
    category: "Electronics",
    brand: "Minimalist Co.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAI_NiFI5gj7BRInCSP1_-Q8sXXPcn-Ar2Mt1kUFFU0aMB3aZEjEPpuWLRReNYr9pOsPeALsEholuKR0wplWC28xHCFPJ8hINqn79NMRy7xiFqHfurU8yJ3iRaMQdNbuweav69uePFEig7UhB535u09x_C_DgmgRukmuupz2WiT_mg6Dzh7yBYcmv3pwQJfyd9KUp14fUKi-flWqGns2rtrx267WjiWggFNXAzxR84vTSbzZc0oruhdZCmCAFrjTPklDjbgWQ_H3iUw",
    inStock: true,
    description: "A gorgeous luxury smartwatch featuring a medical-grade white rubber strap, pristine metallic smartwatch face elements, and complete biometric heart-logs.",
    specifications: {
      "Biometrics": "Heart, SpO2, Sleep Tracking pro",
      "Strap": "Anti-dust medical elastomer",
      "Waterproofing": "IP68 Submersible"
    }
  },
  {
    id: "bass-go-wireless-buds",
    name: "Bass-Go Wireless Buds",
    price: 1299,
    originalPrice: 2499,
    currency: "INR",
    category: "Electronics",
    brand: "Minimalist Co.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBbgdIGZZdgVMdTjBCLlUDtGI4gTnv9G_ptlBpqcQZr2wcU4GX-uijhVFjwEOlpAWvKTn8nSuj1mmtlwbb6aguqk3VOeqyB_wNAgLxawvaSq5kkGvcoeGW8cEOQORs_Py9tq5lD4oBEqeYOq9OLuJpkuSIctm34nzFyQ6CN-I6Vb6de-abeBy2h24s3VLYrPsdnjT-MMQAot-bcXvXCZFRL55C9PEnSf-_NUoXqciKWhMvxhcnRbI06z5RNkyl3qXuycxQKmjQ97qf5",
    inStock: true,
    description: "Matte navy blue Bluetooth ear buds tuned for rich bass lines, complete active noise blockages, and an incredibly light pocket carrying box.",
    specifications: {
      "Battery Charge": "30 Hrs total case, 7 Hrs buds",
      "Drivers": "12mm carbon nanocomposite",
      "ANC level": "32dB acoustic isolate"
    }
  },
  {
    id: "aviator-classic-gold",
    name: "Aviator Classic Gold",
    price: 1899,
    rating: "4.2 ★",
    currency: "INR",
    category: "Fashion & Apparel",
    brand: "Urban Loft",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC0355R5m9s7wBq9Drok9u7V7Z1d-ixbADZtsxCD6th99mfoODr9q3KDugwGPtyp4cSENulByyo3h4dWoo6FCba42mS0QvbTIXRyk36QxtNgjdK2bVfPpweMmS-hGtX8fQ3nSGhVVb0dKcCNGel5OgzXgT3wxxiuRClzGiQI7xv42IXtpczlYZrid4YyiPxRLiUJ8nBZ82vZU6JmGK__nDgIlluwZ9PN8G0rph1Dptn6p-3J-KnPpjL1zpyIU9jSy_5uvka5oqEm6BU",
    inStock: true,
    description: "Stately 24k gold galvanic plating layout, scratch-hardened glass lenses, and double weighted hinges for unparalleled balanced wear.",
    specifications: {
      "Plating": "24k Gold Galvanic flash",
      "Hinge": "Double spring high durability",
      "Glasses": "Hardened shatterproof mineral glass"
    }
  },
  {
    id: "nordic-ceramic-vase",
    name: "Nordic Ceramic Vase",
    price: 899,
    originalPrice: 1200,
    currency: "INR",
    category: "Home Decor",
    brand: "Pure Silk",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA3e8WUXRAcV9QhAJr7gvOVeYoxGJW8xhpEgbnXmXW-PytCISi8JqeZnrdVIKR2pEh7dk1ccYr1y2kxWvTH16V2dWPxGUE1awpXiFPBKBMEfEYAwwo1XS4G6d6w2QNPl3bibSTSCXAx5HYQJDhg1Wvnshw-GlX2gXjx3GdypqeRIJo9r-CHVEkXEZmIbhk56bBRQt9MaaLZDXZn0VKtXPTy4bbqQgehIkeMlvWrpewlhOL5Y0yjcjdrF6z_uo4rR3BEO00n7bIG3sJ-",
    inStock: true,
    description: "Perfectly styled with unglazed hand finishes and raw, grainy earthenware clay. Beautiful alone or paired with neutral interior dry wild stalks.",
    specifications: {
      "Pottery": "Traditional raw kiln baked",
      "Vibe": "Scandinavian minimalist organic",
      "Care": "Damp wipe clean only"
    }
  },

  // Main Featured Page 3 Luxe Product
  {
    id: "luxe-minimalist-ceramic-tea-set",
    name: "Luxe Minimalist Ceramic Tea Set",
    price: 189,
    originalPrice: 245,
    currency: "USD",
    category: "Home & Kitchen",
    brand: "Sarvam Signature",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLEWD6qVnDU1i35opLcl3ITm8j0PpxyXo1O1oBPl0eAqEnGKbyDv5eXhP5K27RKLlzPFP3DSMcQCrUdx6yHb0bqCd74I05rHMxVbT2Gp7AKcsCzeIiXpUT_UonA6SSzBwrOJrUm8FM1fHF7kA6M4egSfUhwrtafec47C5cKrzONpyWhGy_12KhiEWvhisFZWJjC6ytNvc7NeagilTy9WSmjpxRfOTeeeGmc5BzfQ2CX2xC8-tS6ODmm3kiGU46vU48HdOTk4T10S4t",
    thumbnails: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC_oSQid-BlV-n_hh6jyIAsEzNdZb_DtbKwCvbrXuXepgxeKIx9DjHp1mRGL8Syu9McSkLeK1VxQSNVPUVpfSQqVR1-5Qk57CgFhccTJ4F1TjGiIGW5yzjbYg_3Im_xQDGX3AzLv_kRqdLTOJYwIPYhBq10BRJ6N0xSPUySszYUZg-OOo2SWk4Hu422DxzZ-hKC2CN9fb5PTC2-F9qARos3ihB5hk8CKgOWvywJbodA_ZebIt_ccm5B8-duIwlWDc6gAj5Bk3dfIZui",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCJKvLNWJ5-ypYXySu-Iwta-1_rTdWGTlmtjAlPdoV4zQpjYA-tJ8ndjA_EEwiDnqrYjbwMgRruwyJZ2c80n8OL3K9pH-ljdfEN99yX79m8-PQD-A3WR0h87wHjBIfzPKjAo-bZA0aroFtfD7DyQlgrFfemYH6onUUBh8wbZC3BiKhCa4aW-l6dhb8dxAYgt30EOJuOTOyLZTILm-Fk8FXDaYBE2iPe97tnvfNzz0CxD8zdmyx50LJfgB_duqU6_lt_o1-uYvDK4MHA",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAG91Qmy8CxEgdVCNc5qwXZ_q0zGGqE6ihkVzMwQ5oDeyNjcgv-liC0mjKA2AMU2MfsXBXA5f63b7IMBnlSWmIde3wULQ5ZjRydLqI-3PG1UPyEgPMaKYDep4Ffu2jrCJdpwEFMA3vOa6c5xWgnnWZ3eVJtk-y7wPvRGDnIEACoLauYYpsrgknHZ4vBe9AgvoL5IRZ8r16AhAlH3RuJWD8mBxB4DPNYL5oHr_cyu61QAmTi_WIcWuVxgdfL350m4roHjVOVcl1rdiRw"
    ],
    inStock: true,
    tag: "25% OFF",
    description: "Experience the perfect harmony of form and function with our Luxe Minimalist Ceramic Tea Set. Crafted from the finest porcelain, each piece is individually fired to achieve a unique, subtle matte texture that feels as good as it looks. The set features a double-walled insulation design that keeps your beverage at the perfect temperature while remaining cool to the touch. The ergonomic handle of the teapot provides a balanced pour, reflecting the thoughtful engineering behind its minimalist silhouette.",
    specifications: {
      "Material": "Fine Porcelain",
      "Weight": "1.2 kg",
      "Color": "Matte Bone White",
      "Dimensions": "24 x 18 x 12 cm"
    },
    bulletPoints: [
      "Sustainably sourced artisanal porcelain materials.",
      "Dishwasher and microwave safe for daily convenience.",
      "Anti-drip spout technology for a clean tabletop.",
      "Available in a range of neutral, interior-inspired tones."
    ]
  },

  // Related detailed items
  {
    id: "matte-black-kettle",
    name: "Matte Black Kettle",
    price: 79,
    currency: "USD",
    category: "Kitchen Essentials",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDAig7dgk69hvWlrxBhBKgP5yh54FKtyybDioeS-daTtQkXQO-Oo6lWmYXtejX9FHt6Q8rCeVFW0XkGhHzfWKJtNMm6gRvDB7R1niKxJGhC5MCI5-GnqxwrKCvepZ03bEzk7JiaCuzwHhzYh_ho56WmaYZDqjiNp4krvVrCEK8dVkQhW9kEtE4ylvcZ64wrKMTXOBNdd7WofGR9nxbeL76y01P7_9uqHYX0kGNLMfgrwUPapiTLWXvcbAgmz2oXaZVt5DsYOb0IMRRa",
    inStock: true,
    brand: "Minimalist Co.",
    description: "Sleek temperature-controlled black water kettle. Double-walled interior styled with raw volcanic finishes.",
    specifications: {
      "Capacity": "1.7 Liters",
      "Voltage": "120V - 60Hz",
      "Material": "Precision food steel core"
    }
  },
  {
    id: "marble-serving-tray",
    name: "Marble Serving Tray",
    price: 120,
    currency: "USD",
    category: "Kitchen Essentials",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYYE0ZT5lpXhoubNtlbb6i1z0ZvYccAQQ0nRl_PtRP56jD1AN3VVs2aKMF8DIQeIvnQAcmz4LkaLpVup_-0UYsm4d2ddDq6WwcwlCThHBfS8RNKkPTSRwKIXhB5Y8MnOmW-HMnj18RvAiN0Mj9lcPKyT5IKIsq2nPe-vvBNZc06EMCoiJ4hHWiC6UQdvgncAkaQxIhGlv0JnuvFOA8N2b0haQwW4fs-jiPuRHlbgNSr2yb1FnRCIhsYLoCUvAYnW_uu6QbSIUgsFUh",
    inStock: true,
    brand: "Sarvam Signature",
    description: "Artisanal plate carved from single block Carrera marble, coupled with fine solid oiled European oak accents.",
    specifications: {
      "Stone Origin": "Carrera, Italy",
      "Wood Accents": "Oiled Solid White Oak",
      "Care": "Mild food safe oils periodically"
    }
  },
  {
    id: "organic-glass-vases",
    name: "Organic Glass Vases",
    price: 45,
    currency: "USD",
    category: "Home Decor",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDSG3Grv6Wz3gyWp006Cp3Ig4ux8GUREyBrG_zAa5SnRWxw_g8ARW7PLSBJ9ksAjkTT5VKsaJq466Lb6EhlfPznja1RchYtgd2pLM0sMmHm0W1dtJxTbo-lolIx3hzYKGv8mBoRyxqNQcrYLdgSMzdoPu7EJTpGXf49w1NbXw0kLybZPox8JSsMMZenXDT7T0w0NrAbZo2YOuW0s-Bp96ccAkdwIVs2GK7kx4beWzdiUqnlDPxZXvLdQSRXhQ7-m4szfDHOIf0TfK2e",
    inStock: true,
    brand: "Pure Silk",
    description: "Artisan mouth-blown glass containers colored with mineral smoky grays. Perfect as dynamic tabletop sculptures.",
    specifications: {
      "Glassmaking": "Mouth-blown custom furnace",
      "Coloring": "Mineral infusion smoky gray",
      "Height": "18cm"
    }
  },
  {
    id: "linen-bedding-set",
    name: "Linen Bedding Set",
    price: 210,
    currency: "USD",
    category: "Home Decor",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBaGX55vzAjXDgs6W5NaIja_9L62vncHQCCqhnN-yt4MPPDObteurfr1btvDqvq7XQ6drSQV4C3bmS9gh_lvY30ERtqb_G8BjSUT1Uji-fip2Q_rSilx5gO_TDXCqdQsThsn1v8fj-0MKJ6qW9UpxuqZ_faneuLZBjGJ5gEtaYqo8OYp6DjqV0cB55Hf4G2GXdIx0e0JUUItt8vV_ibuV3ZeHvZdrg6OQYdTtuBpYvJLfyDz5fvfTxMeCkNwNW-tD2DZ7F-i5m8l8-J",
    inStock: true,
    brand: "Pure Silk",
    description: "Premium French flax linen beddings. Pre-washed with fine pumice stones to yield a luxurious, velvet-soft rumpled feel.",
    specifications: {
      "Fabric Material": "100% French Flax Flax",
      "Process": "Shatter washed with volcanic pumice",
      "Thread": "Breathable high airflow knit"
    }
  },
  {
    id: "slimline-floor-lamp",
    name: "Slimline Floor Lamp",
    price: 155,
    currency: "USD",
    category: "Home Decor",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzmYFPaiEg_-P7iZH8_q2EKow1ZonFCUG4IX63170FPR4_lNhMUzx8evjuZv5d8pRGB_535zpkRqPAh6NJNhgty4oD6sUI46A-mcaY5T5HK-rP6Z0Mf-yjJXImXFMM0bjcbO30soqaXppVixNFoF2kC6rHQnhQ4CRCKHX3En31nfQC2iFSWPqE-9fwBBAxUJHtKqO8DU60Mh24eZeOKJL0qneOwYxHIfv_O_aDTPtSPJRLHGmkInQ_twi-REYM7T5T6tpR3mlF0z-w",
    inStock: true,
    brand: "Urban Loft",
    description: "Sleek industrial floor lamps made with powder-coated solid metal tubing, housing warm Edison filament bulbs.",
    specifications: {
      "Frame Alloy": "Structural powder black steel",
      "Bulb Support": "E26 standard Edison support",
      "Height": "155 cm"
    }
  },
  
  // Hardcoded default Cart Items from Page 4 Cart Screen mockup
  {
    id: "minimalist-ceramic-watch",
    name: "Minimalist Ceramic Watch",
    price: 129,
    currency: "USD",
    category: "Fashion & Apparel",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDajZgFjrwGGsVOii4KAJG3Fm_enQwk5c80neL3GhPBw-aYQsUkZBlSfDihpTHztNejH6g_SMyBNH3XomYqoqrlJh8fnKGr2NTrlLEhFiA2Avt_hTalVLSsQl_dgXPPFmczF-1YXm68-5wW8ekJh_Bs0Nx0pjblHDRjXW2BWAmNiG5EaUwEoUtBlBXZy9wAan4xVS1Q8mzghLedDY-rA4yge9TpZCV8s3r0TGisYikQfTHOsAh1xFiYoxnmGtNnLE3G-5Puq_nSVpEF",
    inStock: true,
    brand: "Sarvam Signature",
    description: "Refined matte finish ceramic wristwatch set against elegant gray tones."
  },
  {
    id: "studio-bass-headphones",
    name: "Studio Bass Headphones",
    price: 249,
    currency: "USD",
    category: "Electronics",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAoEZ-PedOmwp3e7bFaxtPsgt8uHWMx3HjOAvhu4xtnG9cq8pp_T9yWqjtQhXrrjupxUe2Tu1Bol1DGIw3tIkymE7ylgV7NVn_5YL0fEMWva-3gda5CJkbTPFvikqeAI02Gev1IOa6sKKiye07PzMzfs1TQ-u5RFIlWVKRIEU07f0P_2wc23v_KhJNMDPU4PEfBS3oyeqVz2l07u7kT36yMhWbB2xp9V46TPx1Db8605uKx8L8469WsBT2g57HxCrQ31oodMrTzNehZ",
    inStock: true,
    brand: "Minimalist Co.",
    description: "Sleek studio grade headphones resting comfortably on polished wood configurations."
  }
];

export const WISHLIST_PRESETS: Product[] = [
  {
    id: "aero-max-sneakers",
    name: "Aero Max Sneakers",
    price: 189,
    currency: "USD",
    category: "Fashion & Apparel",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNrgfx44LYRyFPxCm-5bGjKM6S1H9Z5AqsYG4KlabYm37SduxgxwHu-EGRfDI5d09lEqRLlP5rCfnbe3bGJul-9xZraX5kUXOS6zPD2eWVD9Fbn3OY2b-Opss-sfdrPLzuQYcN-RxkDVz07fno6I2VuY6xvEXOKycLgnqYqpu130S3m0bvx3tsqA3gtxMvLzvRty02uJjpW-8amiV_nnK2GIgl1MtQksbmes_B8EWkqvkI3ozrqQNI5qkk0UOhRlSDaLVqeMTNTQLh",
    inStock: true,
    brand: "Urban Loft",
    description: "Red / Performance"
  },
  {
    id: "glow-serum-set",
    name: "Glow Serum Set",
    price: 85,
    currency: "USD",
    category: "Personal Care",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAa9s7Y8nyiuz0G870fEOsDJ6cqwfkIUQd8wXS_d8kJ1zWPNU_c30WFjW04pVAYm5Jukcxw2-G4KmZmjXpkj51NZSawtj2mf9RKh6CA2RxqHI_J1u97GpHBIn17jivEo1BvM2qayApf2fsLOA2Io4aTdy1ZYInBl4XoaMk8MBjXWCDHuARQwKY88RtLE7Pf7Ixw49EZHPq6njgjzbstjpAcK-NEEv4o1VN9agz2_CZr8DjOKlveyTv5MRxZINJmfWaTJSfxnscdT-lZ",
    inStock: true,
    brand: "Pure Silk",
    description: "Limited Edition Pack"
  },
  {
    id: "aviator-modern-glasses",
    name: "Aviator Modern Glasses",
    price: 155,
    currency: "USD",
    category: "Fashion & Apparel",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDzhngcanNMRHgDeUY-pSZ9bcZ7sRU3zmOqH3nc_b2Dg7jy_GCmK5rLPJfiXOylxmeTXVGt_ybPkIOo-ThjbznGPKy4qETF-RnXen1Loyoc8T8CRfTfJu7QJUV-driP69Yb0mhTHBhKZYKdyjs0ShATeQ39Eqk3hjdWZ_jAZ-4did8JpdtGvRfSfvCVwBMRP7xhywryw8TjGXG-s79VpBn53bvtEosGd_KpUeawJZbUhLvuhKGSWCEZWrm8vBUOgZ-rcBPpi9ERHpVh",
    inStock: true,
    brand: "Urban Loft",
    description: "Dark Gradient / Gold"
  }
];
