import { useMutation } from "@tanstack/react-query";
import DownloadService from "../../services/downloadService";
import toast from "react-hot-toast";
import axios from "axios";

export function useDownloadFile() {
  const { mutate: downloadFile, isLoading: isDownloading } = useMutation({
    mutationFn: async (filePath) => {
      return await DownloadService.downloadFile(filePath);
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.data) {
        toast.error(`Erreur: ${error.response.data.message}`);
      } else {
        toast.error(`Erreur lors du téléchargement du fichier.`);
      }
    },
  });

  return {
    downloadFile,
    isDownloading,
  };
}
