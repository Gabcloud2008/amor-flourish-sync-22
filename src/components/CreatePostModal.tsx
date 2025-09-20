import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { X, Image, Video, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface CreatePostModalProps {
  onClose: () => void;
  onPostCreated: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ onClose, onPostCreated }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async (files: File[]) => {
    const uploadedUrls: string[] = [];
    
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      const isImage = file.type.startsWith('image/');
      const bucket = isImage ? 'post-images' : 'post-videos';
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      uploadedUrls.push(publicUrl);
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || (!content.trim() && files.length === 0)) return;

    setLoading(true);

    try {
      let mediaUrls: string[] = [];
      let mediaType: string | null = null;

      if (files.length > 0) {
        mediaUrls = await uploadFiles(files);
        mediaType = files[0].type.startsWith('image/') ? 'image' : 'video';
      }

      const { error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content_text: content.trim(),
          media_urls: mediaUrls.length > 0 ? mediaUrls : null,
          media_type: mediaType
        });

      if (error) throw error;

      toast.success('Publicación creada exitosamente');
      onPostCreated();
      onClose();
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Error al crear la publicación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="card-romantic max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-foreground">
            Crear Publicación
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Content Textarea */}
          <div>
            <Textarea
              placeholder="¿Qué quieres compartir?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="input-romantic min-h-[100px] resize-none"
            />
          </div>

          {/* File Upload */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <label htmlFor="file-upload" className="btn-soft cursor-pointer text-sm">
                <Upload className="w-4 h-4 mr-2" />
                Subir archivos
              </label>
              <Input
                id="file-upload"
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* File Preview */}
            {files.length > 0 && (
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-card-soft rounded-button"
                  >
                    <div className="flex items-center space-x-2">
                      {file.type.startsWith('image/') ? (
                        <Image className="w-4 h-4 text-primary" />
                      ) : (
                        <Video className="w-4 h-4 text-accent-foreground" />
                      )}
                      <span className="text-sm text-foreground truncate">
                        {file.name}
                      </span>
                    </div>
                    <Button
                      type="button"
                      onClick={() => removeFile(index)}
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="btn-soft flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || (!content.trim() && files.length === 0)}
              className="btn-romantic flex-1"
            >
              {loading ? 'Publicando...' : 'Publicar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;