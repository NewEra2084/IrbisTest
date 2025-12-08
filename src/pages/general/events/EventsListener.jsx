import { useEffect, useContext } from "react";
import { useEventsStore } from "@/store/eventsStore";
import { waitChangeEvents } from "@/js/api-events";
import { bindEventActions, handleEvents } from "@/js/event/actions/eventActions";
import {extractStoreMethod} from "@/js/utils";
import { AppContext } from "@/store/context/AppContext";

export default function EventsListener({handleChanges}) {
  const {
    lastChangeId,
    setLastChangeId,
    pollingPaused,
    pausePolling,
  } = useEventsStore();

  const appCtx = useContext(AppContext);

  const eventActions = bindEventActions(appCtx);

  useEffect(() => {
    let cancelled = false;

    async function startPolling(currentId) {
      if (!currentId || pollingPaused) return;

      while (!cancelled && !pollingPaused) {
        try {
          const data = await waitChangeEvents(currentId);

          if (data.changes?.length) {
            handleEvents(eventActions,data.changes);
          }

          if (data.lastChangeId) {
            setLastChangeId(data.lastChangeId);
            currentId = data.lastChangeId;
          }

        } catch (err) {
          // Останавливаем поллинг при 401 или 403
          if (err.code === 401 || err.code === 403) {
            console.warn("Authorization error, polling paused");
            pausePolling();
            return;
          }

          console.error("Long poll error", err);
          await new Promise((res) => setTimeout(res, 2000));
        }
      }
    }

    startPolling(lastChangeId);

    return () => {
      cancelled = true;
    };
  }, [lastChangeId, pollingPaused]);

  return null;
}