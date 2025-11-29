export interface Reflection {
    id: string;
    content: string;
    userId: string;
    surah?: number;
    startAyah?: number;
    endAyah?: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateReflectionRequest {
    startAyah?: number;
    endAyah?: number;
    surah?: number;
    content: string;
}

export interface UpdateReflectionRequest {
    content: string;
}

export interface ReflectionsResponse {
    success: boolean;
    message: string;
    data: {
        payload: Reflection[];
        paginationMeta: {
            total: number;
            limit: number;
            page: number;
            totalPages: number;
            hasNext: boolean;
            hasPrevious: boolean;
        };
    };
}

export interface ReflectionResponse {
    success: boolean;
    message: string;
    data: Reflection;
}