<template>
  <div>
    <RouterLink to="/" class="text-indigo-600 hover:underline text-sm mb-6 inline-block">
      ← Zurück
    </RouterLink>

    <div v-if="loading" class="text-gray-500">Wird geladen...</div>
    <div v-else-if="!result?.product" class="text-gray-500">Produkt nicht gefunden.</div>

    <template v-else>
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <div class="md:flex">
          <!-- Images -->
          <div class="md:w-1/2">
            <div class="aspect-square bg-gray-100">
              <img
                v-if="product.images && product.images.length"
                :src="product.images[0].url"
                :alt="product.images[0].alt || product.name"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                Kein Bild
              </div>
            </div>
            <!-- Thumbnails -->
            <div v-if="product.images && product.images.length > 1" class="flex gap-2 p-4">
              <img
                v-for="(img, i) in product.images.slice(1, 5)"
                :key="i"
                :src="img.url"
                :alt="img.alt || ''"
                class="w-16 h-16 object-cover rounded-lg border border-gray-200"
              />
            </div>
          </div>

          <!-- Details -->
          <div class="md:w-1/2 p-6 flex flex-col gap-4">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ product.name }}</h1>
              <p class="text-sm text-gray-500 mt-1">{{ product.version }}</p>
            </div>

            <div class="flex items-center gap-3">
              <StarRating
                :rating="product.rating?.averageRating ?? 0"
                :count="product.rating?.reviewCount ?? 0"
              />
            </div>

            <div>
              <span
                v-if="product.inStock"
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
              >
                Verfügbar
              </span>
              <span
                v-else
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800"
              >
                Nicht vorrätig
              </span>
            </div>

            <div class="flex items-baseline gap-3">
              <span class="text-3xl font-bold text-gray-900">{{ formatPrice(product.price) }}</span>
              <span v-if="product.listPrice" class="text-lg text-gray-400 line-through">
                {{ formatPrice(product.listPrice) }}
              </span>
            </div>

            <button
              class="w-full font-semibold py-3 px-6 rounded-lg"
              :class="product.inStock
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white transition-colors'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'"
              :disabled="!product.inStock"
            >
              In den Warenkorb
            </button>
          </div>
        </div>

        <!-- Description -->
        <div class="p-6 border-t border-gray-100 grid md:grid-cols-2 gap-6">
          <div>
            <h2 class="font-semibold text-gray-900 mb-2">Kurzbeschreibung</h2>
            <p class="text-gray-600 text-sm leading-relaxed">{{ product.shortDescription }}</p>
          </div>
          <div>
            <h2 class="font-semibold text-gray-900 mb-2">Beschreibung</h2>
            <p class="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
              {{ product.longDescription }}
            </p>
          </div>
        </div>

        <!-- Reviews -->
        <div class="p-6 border-t border-gray-100 flex flex-col gap-6">

          <!-- Ihre Bewertung (logged-in only) -->
          <div v-if="isLoggedIn">
            <h2 class="font-semibold text-gray-900 mb-3">Ihre Bewertung</h2>
            <!-- Already reviewed -->
            <div v-if="myReview" class="bg-yellow-50 rounded-lg p-4 flex flex-col gap-1">
              <div class="flex items-center justify-between">
                <span class="font-medium text-gray-900 text-sm">{{ myReview.name }}</span>
                <span class="text-gray-400 text-xs">{{ formatDate(myReview.createdAt) }}</span>
              </div>
              <StarRating :rating="myReview.stars" />
              <p class="text-gray-600 text-sm mt-1">{{ myReview.text }}</p>
            </div>
            <!-- Form -->
            <form
              v-else-if="!submitted"
              @submit.prevent="submitReview"
              class="flex flex-col gap-3"
            >
              <div class="flex gap-1">
                <button
                  v-for="s in 5"
                  :key="s"
                  type="button"
                  @click="newStars = s"
                  @mouseenter="hoverStars = s"
                  @mouseleave="hoverStars = 0"
                >
                  <i :class="s <= (hoverStars || newStars)
                    ? 'fa-solid fa-star text-yellow-400 text-xl'
                    : 'fa-regular fa-star text-gray-300 text-xl'"
                  ></i>
                </button>
              </div>
              <textarea
                v-model="newText"
                rows="3"
                placeholder="Ihr Kommentar..."
                class="w-full rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500 resize-none"
              />
              <p v-if="submitError" class="text-xs text-red-600">{{ submitError }}</p>
              <button
                type="submit"
                :disabled="!newStars || !newText.trim() || submitting"
                class="self-start px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
              >
                {{ submitting ? 'Wird gespeichert…' : 'Bewertung abschicken' }}
              </button>
            </form>
            <!-- Just submitted, refetch in progress -->
            <p v-else class="text-sm text-green-700">Vielen Dank für Ihre Bewertung!</p>
          </div>

          <!-- Bewertungen (other reviews) -->
          <div>
            <h2 class="font-semibold text-gray-900 mb-3">Bewertungen</h2>
            <div v-if="reviewsLoading" class="text-gray-500 text-sm">Wird geladen...</div>
            <div v-else-if="!otherReviews.length" class="text-gray-400 text-sm">Keine Bewertungen vorhanden.</div>
            <div v-else class="flex flex-col gap-4">
              <div
                v-for="review in otherReviews"
                :key="review.id"
                class="bg-gray-50 rounded-lg p-4 flex flex-col gap-1"
              >
                <div class="flex items-center justify-between">
                  <span class="font-medium text-gray-900 text-sm">{{ review.name }}</span>
                  <span class="text-gray-400 text-xs">{{ formatDate(review.createdAt) }}</span>
                </div>
                <StarRating :rating="review.stars" />
                <p class="text-gray-600 text-sm mt-1">{{ review.text }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useQuery, useMutation } from '@vue/apollo-composable';
import { gql } from '@apollo/client/core';
import StarRating from '../components/StarRating.vue';
import { useAuth } from '../composables/useAuth';

const props = defineProps<{ id: string }>();

const { isLoggedIn, user } = useAuth();

const PRODUCT_DETAIL = gql`
  query ProductDetail($id: ID!) {
    product(id: $id) {
      id
      name
      version
      shortDescription
      longDescription
      price
      listPrice
      inStock
      images { url alt }
      rating { averageRating reviewCount }
    }
  }
`;

const REVIEWS_QUERY = gql`
  query Reviews($productId: ID!, $first: Int, $after: String) {
    reviews(productId: $productId, first: $first, after: $after) {
      totalCount
      pageInfo { hasNextPage endCursor }
      edges {
        node { id userId name stars text createdAt }
      }
    }
  }
`;

const { result, loading } = useQuery(PRODUCT_DETAIL, () => ({ id: props.id }));
const product = computed(() => result.value?.product);

const { result: reviewsResult, loading: reviewsLoading, refetch: refetchReviews } = useQuery(
  REVIEWS_QUERY,
  () => ({ productId: props.id, first: 100 }),
);
const reviews = computed(() =>
  (reviewsResult.value?.reviews?.edges ?? []).map((e: any) => e.node),
);
const myReview = computed(() => reviews.value.find((r: any) => r.userId === user.value?.id));
const otherReviews = computed(() => reviews.value.filter((r: any) => r.userId !== user.value?.id));

// Add review form state
const newStars = ref(0);
const hoverStars = ref(0);
const newText = ref('');
const submitting = ref(false);
const submitted = ref(false);
const submitError = ref('');

const ADD_REVIEW = gql`
  mutation AddReview($productId: ID!, $stars: Int!, $text: String!) {
    addReview(productId: $productId, stars: $stars, text: $text) { id }
  }
`;

const { mutate: addReview } = useMutation(ADD_REVIEW);

async function submitReview() {
  if (!newStars.value || !newText.value.trim()) return;
  submitting.value = true;
  submitError.value = '';
  try {
    await addReview({ productId: props.id, stars: newStars.value, text: newText.value.trim() });
    submitted.value = true;
    await refetchReviews();
  } catch (e: any) {
    submitError.value = e?.graphQLErrors?.[0]?.message ?? 'Fehler beim Speichern.';
  } finally {
    submitting.value = false;
  }
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(price);
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(iso));
}
</script>
