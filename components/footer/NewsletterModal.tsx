import { useSignal } from "@preact/signals";
import { invoke } from "$store/runtime.ts";
import type { JSX } from "preact";
import type { ImageWidget } from "apps/admin/widgets.ts";
import Icon from "$store/components/ui/Icon.tsx";
import { Picture, Source } from "apps/website/components/Picture.tsx";

export interface BackgroundImages {
  /** @title Imagem inicial de fundo */
  initial: ImageWidget;
  /** @title Imagens de fundo após inscrição */
  success: ImageWidget;
}

export interface Backgrounds {
  desktop: BackgroundImages;
  mobile: BackgroundImages;
}

export interface Props {
  /** @title Imagens de fundo */
  backgrounds: Backgrounds;
}

function Newsletter(
  { backgrounds }: Props,
) {
  const { desktop, mobile } = backgrounds;
  const loading = useSignal(false);
  const success = useSignal(false);
  const open = useSignal(true);

  const handleSubmit: JSX.GenericEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      loading.value = true;

      const email =
        (e.currentTarget.elements.namedItem("email") as RadioNodeList)?.value;

      await invoke.vtex.actions.newsletter.subscribe({ email });
    } finally {
      loading.value = false;
      success.value = true;
    }
  };

  return (
    <>
      {open.value && (
        <div class="block">
          <div class="bg-black opacity-50 fixed inset-0 z-40"></div>
          <div class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-h-[550px] max-w-[745px] z-50">
            <button
              class="absolute top-[5px] right-0 translate-x-1/2 bg-[#333333] border-none rounded-full p-[0.2rem] cursor-pointer"
              onClick={() => open.value = false}
            >
              <Icon id="CloseNewsletter" width={25} height={25} />
            </button>
            <div class="w-full h-full absolute -z-[1]">
              {success.value
                ? (
                  <Picture>
                    <Source
                      media="(max-width: 767px)"
                      src={mobile.success}
                      width={393}
                      height={555}
                    />
                    <Source
                      media="(min-width: 768px)"
                      src={desktop.success ? desktop.success : mobile.success}
                      width={745}
                      height={550}
                    />
                    <img
                      class="w-full"
                      sizes="(max-width: 640px) 100vw, 30vw"
                      src={mobile.success}
                      alt="Imagem de fundo do modal de newsletter"
                      decoding="async"
                      loading="lazy"
                    />
                  </Picture>
                )
                : (
                  <Picture>
                    <Source
                      media="(max-width: 767px)"
                      src={mobile.initial}
                      width={393}
                      height={555}
                    />
                    <Source
                      media="(min-width: 768px)"
                      src={desktop.initial ? desktop.initial : mobile.initial}
                      width={745}
                      height={550}
                    />
                    <img
                      class="w-full"
                      sizes="(max-width: 640px) 100vw, 30vw"
                      src={mobile.initial}
                      alt="Imagem de fundo do modal de newsletter"
                      decoding="async"
                      loading="lazy"
                    />
                  </Picture>
                )}
            </div>
            <form
              class="flex flex-col items-start justify-center gap-4 relative top-3/4 left-[50px] -translate-x-1/2"
              onSubmit={handleSubmit}
            >
              <input
                class="p-[5px] w-full max-w-[250px]"
                type="text"
                name="firstName"
                required
                placeholder="Nome:"
              />
              <input
                class="p-[5px] w-full max-w-[250px]"
                type="email"
                name="email"
                required
                placeholder="E-mail:"
              />
              <button class="border-none py-2 px-4 bg-[#f70000] text-white cursor-pointer font-bold">
                ASSINAR
              </button>
              <div class="flex items-center gap-[1ch] text-white">
                <input
                  class="w-auto p-[5px] max-w-[250px]"
                  type="checkbox"
                  id="newsletter"
                  name="newsletter"
                />
                <label for="newsletter">
                  Aceito receber ofertas e novidades por e-mail
                </label>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Newsletter;
