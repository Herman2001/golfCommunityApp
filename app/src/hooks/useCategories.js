import { useCallback, useEffect, useState } from 'react';
import { fetchCategories } from '../api/categories';

/**
 *  Egen hook för att hämta kategoriers från API, med både laddning och fel läge.
 * Används av inläggslistan och formulären föär att skapa och redigera inlägg.
 */

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
				setCategories(await fetchCategories());
		} catch (e) {
				setError(e.message);
		} finally {
				setIsLoading(false);
		}
	},[]);

  useEffect(() => {
		load();
   },[load]);

	 return { categories, isLoading, error, reload: load};
} 