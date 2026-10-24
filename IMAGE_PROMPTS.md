# 噜噜形象生成记录

工具：内置 `image_gen`（非 CLI/API 回退）。三张均使用用户提供的形象设定图作为身份参考，输出带透明通道的 PNG。

素材映射：`assets/lulu-butler.png`（管家）、`assets/lulu-detective.png`（侦探）、`assets/lulu-sleepy.png`（睡衣）。WebP 为无裁剪缩放与格式转换版本，保留透明通道。原始角色参考保存在 `docs/lulu-reference.png`。

## 小管家

```text
Use case: identity-preserve / stylized-concept
Asset type: transparent mascot cutout for a DeepSeek Harness desktop UI theme, "噜噜 · 小管家".
Reference image 1 is the user's character identity sheet. Use the FRONT full-body character as the exact identity reference; ignore all printed labels and extra views.
Primary request: Dress THIS SAME adorable rounded golden-yellow character as a friendly tiny butler, full body. Preserve the distinctive enormous rounded orange muzzle (smooth, no nostril holes), shiny small black oval eyes, tiny round triangular ears, little orange bun on top of the head, very large head and short chubby body, short yellow limbs, original face and happy gentle smile. It must remain recognizable as this exact character, not a generic capybara, pig, duck or bear.
Outfit: well-tailored espresso-brown little tailcoat with cream waistcoat, crisp white shirt front, warm orange small bow tie, two tiny brass buttons, orange shorts partly visible. NO hat; keep the orange bun visible. One hand gently waves in welcome, the other holds a small neat tea tray with a cream teacup. Keep all anatomy simple and toy-like.
Style: premium soft 3D collectible toy / smooth softly flocked clay render matching the reference, warm soft studio lighting, beautiful rounded details, clean silhouette. Front-facing with a very slight three-quarter turn. Entire body and teacup visible, subject centered, ample transparent padding around all edges.
Backdrop: genuinely transparent background, no floor, no backdrop, no cast shadow outside the character. No lettering, no labels, no watermark, no border, no additional characters.
```

## 小侦探

```text
Use case: identity-preserve / stylized-concept
Asset type: transparent mascot cutout for the same "噜噜" DeepSeek Harness UI theme, alternate outfit "小侦探".
Input image 1: original character identity sheet, use the front full-body character. Input image 2: the matching newly rendered butler character, use its face, proportions, soft 3D toy material and high quality lighting for continuity.
Primary request: Make the SAME rounded golden-yellow character a little detective. Preserve its enormous orange smooth muzzle without nostrils, shiny oval black eyes, tiny rounded ears, orange bun on the crown, huge round head and very short chubby body. Same gentle smile. Full body.
Outfit: warm camel detective cape and tiny cream shirt, russet-orange bow tie, original orange shorts and yellow feet; no hat so the orange bun stays visible. Hold a small magnifying glass in one hand, peer with cheerful curiosity at it; the other hand rests naturally by its side. Front three-quarter view, cute simple anatomy.
Style: premium soft 3D collectible toy, softly flocked clay, warm soft studio lighting, friendly and understated, consistent with image 2.
Composition: character centered with entire body and magnifying glass inside generous padding.
Background genuinely transparent with no floor or external cast shadow. No text, labels, watermarks, other characters, scenery or graphics.
```

## 晚安噜噜

```text
Use case: identity-preserve / stylized-concept
Asset type: transparent mascot cutout for the same "噜噜" DeepSeek Harness UI theme, alternate outfit "晚安噜噜".
Input image 1 is the original character identity sheet; input image 2 is the matching generated butler character. Keep the EXACT same character, face proportions, large head / short chubby body, huge smooth orange muzzle without nostrils, glossy black oval eyes, tiny rounded ears, yellow body, little orange bun on top, happy gentle smiling mouth.
Primary request: dress this same adorable character in soft cream buttoned pajamas with warm amber piping and tiny understated amber stars. No hat: the little orange bun stays visible. A short soft cream sleeping cape drapes around the shoulders; cuddle a small ochre star-shaped cushion in both hands. Standing full body, tiny yellow feet visible, head slightly tilted and eyelids slightly relaxed but eyes open. Cozy quiet bedtime feeling.
Style: premium soft 3D collectible toy / plush-clay render matching image 2, warm soft studio lighting, rounded toy-like hands and limbs.
Composition: centered full body, generous transparent padding around the entire silhouette. Genuinely transparent background, no floor, no outer cast shadow, no lettering, no watermark, no labels, no extra characters, no scenery.
```
